import { NextResponse } from "next/server";

export function builResponse<T>(
  status: number,
  code: string,
  msg: string,
  content?: T,
): NextResponse {
  const respData: MoahResponse<T> = { code: code, msg: msg };
  if (content) {
    respData.content = content;
  }
  return NextResponse.json(respData, { status: status });
}

export const codes = {
  ok: "OK",
  unknown: "UNKNOWN_ERROR",
  validError: "VALIDATION_ERROR",
  authError: "AUTHENTICATION_ERROR",
  notFound: "NOT_FOUND",
};

export interface MoahResponse<T> {
  code: string;
  content?: T;
  msg: string;
}
