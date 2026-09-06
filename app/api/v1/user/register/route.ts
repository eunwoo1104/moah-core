import { NextRequest } from "next/server";

import { ValidationError } from "yup";

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

  // TODO: real logic
  console.log(data.email);

  return builResponse(200, codes.ok, "Success");
}
