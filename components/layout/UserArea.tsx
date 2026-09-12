import { useContext } from "react";

import { HeaderArea } from "@/components/layout/HeaderArea";
import { SessionContext } from "@/utils/contexts";
import { icons } from "@/utils/icons";

export function UserArea() {
  const sessionCtx = useContext(SessionContext);

  if (!sessionCtx?.user) {
    return (
      <HeaderArea>
        <p>This should not open...</p>
      </HeaderArea>
    );
  }

  return (
    <HeaderArea className="md:w-96">
      <div className="flex flex-row items-center">
        <div className="rounded-full bg-neutral-100 dark:bg-neutral-800 flex justify-center items-center w-12 h-12">
          {icons.user /* TODO: show avatar image if set */}
        </div>
        <div className="ml-2">
          <p>{sessionCtx.user.nickname || sessionCtx.user.username}</p>
          <p>@{sessionCtx.user.username}</p>
        </div>
      </div>
      <button className="clickable bg-neutral-100 dark:bg-neutral-800 rounded-lg py-1 w-full text-center mt-2">
        Logout
      </button>
    </HeaderArea>
  );
}
