import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

import { createNewSession } from "@/utils/actions";
import { database } from "@/utils/database";
import { sha256encrypt } from "@/utils/encryption/sha256";
import { verifyJWT } from "@/utils/jwt";
import { getDeviceIdentifier } from "@/utils/request";

async function tryRefreshSession(
  headers: Headers,
  refreshToken: string,
): Promise<number | null> {
  if (!refreshToken) {
    return null;
  }

  const refreshVerify = await verifyJWT(refreshToken);
  if (!refreshVerify) {
    return null;
  }

  const hashedRefreshToken = await sha256encrypt(refreshToken);
  const savedSession = await database
    .session()
    .select("user", "device_identifier")
    .where({ refresh_token: hashedRefreshToken });
  const devIdentifier = getDeviceIdentifier(headers);

  if (savedSession.length === 0) {
    // TODO: in this case JWT secret could be compromised or just whole session was reset, so should add handler for these cases
    return null;
  }

  await database
    .session()
    .delete()
    .where({ refresh_token: hashedRefreshToken });
  if (
    savedSession[0].device_identifier != (await sha256encrypt(devIdentifier))
  ) {
    // in this case refresh token is stolen
    return null;
  }

  // recreate session
  await createNewSession(savedSession[0].user);
  return savedSession[0].user;
}

export async function proxy(req: NextRequest) {
  console.debug(`invoked on ${req.url}`);

  const headers = new Headers(req.headers);
  headers.delete("MoAh-Session-User");
  let sessionUser = null;

  const cookieStore = await cookies();
  const accessToken = cookieStore.get("accessToken");
  if (!accessToken) {
    return;
  }

  const sessionRes = await verifyJWT(accessToken.value);
  sessionUser = sessionRes
    ? (sessionRes.id as number)
    : await tryRefreshSession(
        headers,
        cookieStore.get("refreshToken")?.value as string,
      );
  // TODO: should check whether session is from valid device

  if (sessionUser !== null) {
    headers.set("MoAh-Session-User", sessionUser.toString());
    return NextResponse.next({ request: { headers: headers } });
  }
}

export const config = {
  matcher: [
    {
      source:
        "/((?!api|_next/static|_next/image|user/register|favicon.ico|sitemap.xml|robots.txt).*)",
      has: [{ type: "cookie", key: "refreshToken" }],
    },
  ],
};
