"use client";

import { useState } from "react";

import { SessionContext } from "@/utils/contexts";
import { PartialUser } from "@/utils/types";

export function SessionProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<PartialUser | null>(null);

  return <SessionContext value={{ user, setUser }}>{children}</SessionContext>;
}
