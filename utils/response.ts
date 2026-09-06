import { NextResponse } from "next/server";

export function builResponse(
  status: number,
  code: string,
  msg: string,
  content?: object,
): NextResponse<MoahResponse> {
  const respData: MoahResponse = { code: code, msg: msg };
  if (content) {
    respData.content = content;
  }
  return NextResponse.json(respData, { status: status });
}

export const codes = {
  ok: "OK",
  unknown: "UNKNOWN_ERROR",
  validError: "VALIDATION_ERROR",
};

export interface MoahResponse {
  code: string;
  content?: object;
  msg: string;
}
