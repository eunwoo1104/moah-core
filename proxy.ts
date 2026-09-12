import { JOSEError, JWTExpired } from "jose/errors";
import { cookies } from "next/headers";
import { NextRequest } from "next/server";

import { verifyJWT } from "@/utils/jwt";

export async function proxy(req: NextRequest) {
  // console.log(`invoked on ${req.url}`);
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("accessToken");
  if (!accessToken) return;

  let sessionRes = null;
  try {
    sessionRes = await verifyJWT(accessToken.value);
  } catch (e) {
    if (e instanceof JWTExpired) {
      sessionRes = null;
    } else if (e instanceof JOSEError) {
      // TODO: better verification fail handling
      sessionRes = null;
    }
  }
  if (!sessionRes) {
    // TODO: reset access token from refresh token
  }
}

export const config = {
  matcher: [
    {
      source: "/((?!api|_next|user/register).*)",
      has: [{ type: "cookie", key: "refreshToken" }],
    },
  ],
};
