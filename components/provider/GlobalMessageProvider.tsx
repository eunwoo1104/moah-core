"use client";

import { useState } from "react";

import type { MessageBoxProps } from "@/components/MessageBox";
import { GlobalMessageContext } from "@/utils/contexts";

export function GlobalMessageProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [message, setMessage] = useState<MessageBoxProps | null>(null);

  return (
    <GlobalMessageContext value={{ message, setMessage }}>
      {children}
    </GlobalMessageContext>
  );
}
