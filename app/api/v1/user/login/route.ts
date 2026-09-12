import { cookies } from "next/headers";
import { NextRequest } from "next/server";
import { ValidationError } from "yup";

import database from "@/utils/database";
import { argon2verify } from "@/utils/encryption/argon2";
import { createJWT } from "@/utils/jwt";
import { builResponse, codes } from "@/utils/response";
import { PartialUser, User } from "@/utils/types";
import { userLoginSchema } from "@/utils/validation";

export async function POST(req: NextRequest) {
  let data;
  try {
    data = await userLoginSchema.validate(await req.json());
  } catch (e) {
    if (e instanceof ValidationError) {
      return builResponse(
        400,
        codes.validError,
        "Request validation failed",
        e.errors,
      );
    } else {
      return builResponse(500, codes.unknown, "Unknown error");
    }
  }

  const userData = await database<User>("user")
    .select()
    .where("email", data.email);
  if (userData.length === 0)
    return builResponse(404, codes.notFound, "Email not registered");

  const matched = await argon2verify(userData[0].password, data.password);
  if (!matched) return builResponse(403, codes.authError, "Invalid password");

  const accessToken = await createJWT({ id: userData[0].id }, "5m");
  const refreshToken = await createJWT({ id: userData[0].id }, "7d");

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

  const user: PartialUser = {
    email: userData[0].email,
    username: userData[0].username,
    nickname: userData[0].nickname,
    avatar: userData[0].avatar,
    createdAt: userData[0].createdAt,
    flags: userData[0].flags,
  };

  return builResponse(200, codes.ok, "Success", user);
}
