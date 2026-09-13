import { userAgent } from "next/server";

export function getDeviceIdentifier(headers: Headers): string {
  const agent = userAgent({ headers: headers });
  return `${agent.os.name},${agent.browser.name},${agent.engine.name},${agent.device.model}`;
}

export function deleteSessionCookies(cookies: {
  delete: (name: string) => void;
}) {
  cookies.delete("accessToken");
  cookies.delete("refreshToken");
}
