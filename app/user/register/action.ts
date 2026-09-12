"use server";

import { InferType, ValidationError } from "yup";

import database from "@/utils/database";
import { argon2encrypt } from "@/utils/encryption/argon2";
import { MoahResponse, codes } from "@/utils/response";
import { userRegistrationSchema } from "@/utils/validation";

export async function registerAction(
  formData: InferType<typeof userRegistrationSchema>,
): Promise<MoahResponse<string[] | null>> {
  let data;
  try {
    data = await userRegistrationSchema.validate(formData);
  } catch (e) {
    if (e instanceof ValidationError) {
      return {
        code: codes.validError,
        msg: "Request validation failed",
        content: e.errors,
      };
    } else {
      return {
        code: codes.unknown,
        msg: "Unknown error",
      };
    }
  }

  const emailExists = await database("user")
    .select("email")
    .where("email", data.email);
  if (emailExists.length !== 0)
    return {
      code: codes.validError,
      msg: "Email already exists",
    };

  const encrypted = await argon2encrypt(data.password);

  const insertData = {
    email: data.email,
    password: encrypted,
    username: data.username,
    nickname: data.nickname ? data.nickname : null,
  };

  await database("user").insert(insertData);

  // TODO: better response message and/or data
  return { code: codes.ok, msg: "Success" };
}
