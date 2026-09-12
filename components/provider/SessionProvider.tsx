"use client";

import { useEffect, useState } from "react";

import { getCurrentUser } from "@/utils/actions";
import { SessionContext } from "@/utils/contexts";
import { PartialUser } from "@/utils/types";

export function SessionProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<PartialUser | null>(null);

  useEffect(() => {
    getCurrentUser().then(
      (response) => response.content && setUser(response.content),
    );
  }, []);

  return <SessionContext value={{ user, setUser }}>{children}</SessionContext>;
}
