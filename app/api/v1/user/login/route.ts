import { NextRequest } from "next/server";
import { ValidationError } from "yup";

import { createNewSession } from "@/utils/actions";
import database from "@/utils/database";
import { argon2verify } from "@/utils/encryption/argon2";
import { builResponse, codes } from "@/utils/response";
import { PartialUser, User } from "@/utils/types";
import { userLoginSchema } from "@/utils/validation";

export async function POST(req: NextRequest) {
  let data;
  try {
    data = await userLoginSchema.validate(await req.json());
  } catch (e) {
    if (e instanceof ValidationError) {
      return builResponse(400, codes.validError, {
        msg: "Request validation failed",
        content: e.errors,
      });
    } else {
      return builResponse(500, codes.unknown, { msg: "Unknown error" });
    }
  }

  const userData = await database<User>("user")
    .select()
    .where("email", data.email);
  if (userData.length === 0)
    return builResponse(404, codes.notFound, { msg: "Email not registered" });

  const matched = await argon2verify(userData[0].password, data.password);
  if (!matched)
    return builResponse(403, codes.authError, { msg: "Invalid password" });

  await createNewSession(userData[0].id);

  const user: PartialUser = {
    email: userData[0].email,
    username: userData[0].username,
    nickname: userData[0].nickname,
    avatar: userData[0].avatar,
    createdAt: userData[0].createdAt,
    flags: userData[0].flags,
  };

  return builResponse(200, codes.ok, { content: user });
}
