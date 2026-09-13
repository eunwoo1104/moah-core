import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

import { createNewSession } from "@/utils/actions";
import database from "@/utils/database";
import { sha256encrypt } from "@/utils/encryption/sha256";
import { verifyJWT } from "@/utils/jwt";
import { deleteSessionCookies, getDeviceIdentifier } from "@/utils/request";
import { SessionTable } from "@/utils/types";

export async function proxy(req: NextRequest) {
  console.debug(`invoked on ${req.url}`);

  const headers = new Headers(req.headers);
  headers.delete("MoAh-Session-User");
  let sessionUser = null;

  const cookieStore = await cookies();
  const accessToken = cookieStore.get("accessToken");
  if (!accessToken) {
    deleteSessionCookies(cookieStore);
    return;
  }

  const sessionRes = await verifyJWT(accessToken.value);
  if (!sessionRes) {
    const refreshToken = cookieStore.get("refreshToken");
    if (!refreshToken) {
      deleteSessionCookies(cookieStore);
      return;
    }

    const refreshVerify = await verifyJWT(refreshToken.value);
    if (!refreshVerify) {
      deleteSessionCookies(cookieStore);
      return;
    }

    const hashedRefreshToken = await sha256encrypt(refreshToken.value);
    const savedSession = await database<SessionTable>("session")
      .select("user", "device_identifier")
      .where({ refresh_token: hashedRefreshToken });
    const devIdentifier = getDeviceIdentifier(headers);

    if (savedSession.length === 0) {
      // TODO: in this case JWT secret could be compromised or just whole session was reset, so should add handler for these cases
      deleteSessionCookies(cookieStore);
      return;
    } else if (
      savedSession[0].device_identifier != (await sha256encrypt(devIdentifier))
    ) {
      // in this case refresh token is stolen
      await database<SessionTable>("session")
        .delete()
        .where({ refresh_token: hashedRefreshToken });
      deleteSessionCookies(cookieStore);
      return;
    }

    // recreate session
    await createNewSession(savedSession[0].user);
    sessionUser = savedSession[0].user;
  } else sessionUser = sessionRes.id as number;

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
