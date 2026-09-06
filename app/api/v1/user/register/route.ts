import { NextRequest } from "next/server";

import { ValidationError } from "yup";

import database from "@/utils/database";
import { argon2encrypt } from "@/utils/encryption";
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

  const encrypted = await argon2encrypt(data.password);

  const insertData = {
    email: data.email,
    password: encrypted,
    username: data.username,
    nickname: data.nickname,
  };

  await database("moah_core").insert(insertData);

  // TODO: better response message and/or data
  return builResponse(200, codes.ok, "Success");
}
