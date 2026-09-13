"use client";

import { ComponentPropsWithRef } from "react";

export function HeaderCircle({
  className,
  onClick,
  children,
  ...props
}: ComponentPropsWithRef<"button">) {
  return (
    <button
      className={`clickable circle-icon bg-neutral-200 dark:bg-neutral-850 h-12 w-12 ${className}`}
      onClick={onClick}
      {...props}
    >
      {children}
    </button>
  );
}
