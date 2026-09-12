import { createContext } from "react";

import { PartialUser } from "@/utils/types";

interface SessionContextInterface {
  user: PartialUser | null;
  setUser: (session: PartialUser) => void;
}

export const SessionContext = createContext<SessionContextInterface | null>(
  null,
);
