import { createContext } from "react";

import type { MessageBoxProps } from "@/components/MessageBox";
import type { PartialUser } from "@/utils/types";

interface SessionContextInterface {
  user: PartialUser | null;
  setUser: (session: PartialUser | null) => void;
}

interface GlobalMessageContextInterface {
  message: MessageBoxProps | null;
  setMessage: (content: MessageBoxProps | null) => void;
}

export const SessionContext = createContext<SessionContextInterface | null>(
  null,
);

export const GlobalMessageContext =
  createContext<GlobalMessageContextInterface | null>(null);
