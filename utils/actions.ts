"use server";

import { cookies, headers } from "next/headers";

import database from "@/utils/database";
import { sha256encrypt } from "@/utils/encryption/sha256";
import { createJWT } from "@/utils/jwt";
import { getDeviceIdentifier } from "@/utils/request";
import { MoahResponse, codes } from "@/utils/response";
import { PartialUser, SessionTable, UserTable } from "@/utils/types";

export async function createNewSession(userId: number) {
  const accessToken = await createJWT({ id: userId }, "5m");
  const refreshToken = await createJWT({ id: userId }, "7d");

  const cookieStore = await cookies();
  cookieStore.set("accessToken", accessToken, {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    path: "/",
  });
  cookieStore.set("refreshToken", refreshToken, {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    path: "/",
  });

  const reqHeaders = await headers();
  const devIdent = getDeviceIdentifier(reqHeaders);

  await database<SessionTable>("session").insert({
    refresh_token: await sha256encrypt(refreshToken),
    user: userId,
    device_identifier: await sha256encrypt(devIdent),
  });

  // TODO: cleanup too old sessions
}

export async function getCurrentUser(): Promise<
  MoahResponse<PartialUser | null>
> {
  const reqHeaders = await headers();
  /*
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("accessToken");

  if (!accessToken)
    return { code: codes.sessionExpired, msg: "Session expired" };

  const tokenData = await verifyJWT(accessToken?.value);

  if (!tokenData) return { code: codes.sessionInvalid, msg: "Session invalid" };
  */

  const userId = reqHeaders.get("MoAh-Session-User");
  if (!userId) return { code: codes.sessionInvalid, msg: "Session invalid" };

  const data = await database<UserTable>("user")
    .select("email", "username", "nickname", "avatar", "created_at", "flags")
    .where("id", userId);

  if (!data) return { code: codes.notFound }; // This should not happen tho

  const user = {
    email: data[0].email,
    username: data[0].username,
    nickname: data[0].nickname,
    avatar: data[0].avatar,
    createdAt: data[0].created_at,
    flags: data[0].flags,
  };

  return { code: codes.ok, content: user };
}
