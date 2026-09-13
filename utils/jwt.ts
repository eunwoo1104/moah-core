import { JWTPayload, SignJWT, jwtVerify } from "jose";
import { JWTExpired } from "jose/errors";
import "server-only";

const algorithm = process.env.JWT_ALGORITHM as string | "HS256";
const loadedSecret = process.env.JWT_SECRET;
const jwtSecret = loadedSecret && new TextEncoder().encode(loadedSecret);

export function createJWT(
  payload: JWTPayload,
  expiresAt: string | number | Date,
): Promise<string> {
  if (!jwtSecret) throw new Error("JWT secret not provided");

  return new SignJWT(payload)
    .setProtectedHeader({ alg: algorithm })
    .setIssuedAt()
    .setExpirationTime(expiresAt)
    .sign(jwtSecret);
}

export async function verifyJWT(token: string) {
  if (!jwtSecret) throw new Error("JWT secret not provided");

  const { payload } = await jwtVerify(token, jwtSecret, {
    algorithms: [algorithm],
  }).catch((e) => {
    // TODO: should process errors gracefully later
    if (!(e instanceof JWTExpired)) console.error(e);
    return { payload: null };
  });
  return payload;
}
