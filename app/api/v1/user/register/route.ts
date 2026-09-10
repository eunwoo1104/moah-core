import { NextRequest } from "next/server";
import { ValidationError } from "yup";

import database from "@/utils/database";
import { argon2encrypt } from "@/utils/encryption/argon2";
import { builResponse, codes } from "@/utils/response";
import { userRegistrationSchema } from "@/utils/validation";

export async function POST(req: NextRequest) {
  let data;
  try {
    data = await userRegistrationSchema.validate(await req.json());
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

  const emailExists = await database("user")
    .select("email")
    .where("email", data.email);
  if (emailExists.length !== 0)
    return builResponse(400, codes.validError, "Email already exists");

  const encrypted = await argon2encrypt(data.password);

  const insertData = {
    email: data.email,
    password: encrypted,
    username: data.username,
    nickname: data.nickname ? data.nickname : null,
  };

  await database("user").insert(insertData);

  // TODO: better response message and/or data
  return builResponse(200, codes.ok, "Success");
}
