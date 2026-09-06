import * as argon2 from "argon2";

export async function sha256encrypt(text: string): Promise<string> {
  const encoder = new TextEncoder();
  const pwEncode = encoder.encode(text);
  return await crypto.subtle.digest("SHA-256", pwEncode).then((hashBuffer) => {
    const hashArray = Array.from(new Uint8Array(hashBuffer)); // convert buffer to byte array
    return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
  });
}

export function argon2encrypt(text: string): Promise<string> {
  return argon2.hash(text);
}

export function argon2match(hashed: string, text: string): Promise<boolean> {
  return argon2.verify(hashed, text);
}
