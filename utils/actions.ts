"use server";

import { JWTExpired } from "jose/errors";
import { cookies } from "next/headers";

import database from "@/utils/database";
import { createJWT, verifyJWT } from "@/utils/jwt";
import { MoahResponse, codes } from "@/utils/response";
import { PartialUser, UserTable } from "@/utils/types";

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

  // TODO: store these data to database
}

export async function getCurrentUser(): Promise<
  MoahResponse<PartialUser | null>
> {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("accessToken");

  if (!accessToken)
    return { code: codes.sessionExpired, msg: "Session expired" };

  const tokenData = await verifyJWT(accessToken?.value).catch((e) => {
    if (!(e instanceof JWTExpired)) console.error(e);
  });

  if (!tokenData) return { code: codes.sessionInvalid, msg: "Session invalid" };

  const data = await database<UserTable>("user")
    .select("email", "username", "nickname", "avatar", "created_at", "flags")
    .where("id", tokenData.id as number);

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
