import { NextResponse } from "next/server";

export function builResponse<T>(
  status: number,
  code: string,
  { msg, content }: { msg?: string; content?: T },
): NextResponse {
  const respData: MoahResponse<T> = { code: code };
  if (msg) {
    respData.msg = msg;
  }
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
  sessionExpired: "SESSION_EXPIRED",
  sessionInvalid: "SESSION_INVALID",
};

export interface MoahResponse<T> {
  code: string;
  content?: T;
  msg?: string;
}
