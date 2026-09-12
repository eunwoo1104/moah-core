"use client";

import { useEffect, useState } from "react";

import { Toggle } from "@/components/Toggle";
import { HeaderArea } from "@/components/layout/HeaderArea";
import { icons } from "@/utils/icons";

export function SettingArea() {
  const getSelectedTheme = () => localStorage.getItem("theme") || "system";
  const getSystemTheme = () =>
    window.matchMedia("(prefers-color-scheme: dark)")?.matches
      ? "dark"
      : "light";

  const [selectedTheme, setSelectedTheme] =
    useState<string>(getSelectedTheme());

  useEffect(() => {
    if (selectedTheme !== "system")
      localStorage.setItem("theme", selectedTheme);
    else localStorage.setItem("theme", "system");
    document.documentElement.classList.toggle(
      "dark",
      selectedTheme !== "system"
        ? selectedTheme === "dark"
        : getSystemTheme() === "dark",
    );
  }, [selectedTheme]);

  return (
    <HeaderArea className="md:w-64 space-y-2">
      <div className="font-bold text-sm text-neutral-400 flex flex-row items-center space-x-1">
        <div className="inline-block">{icons.theme}</div>
        <p>Theme Setting</p>
      </div>
      <div className="flex flex-row justify-between items-center">
        <p>Dark Mode</p>
        <Toggle
          value={
            selectedTheme === "dark" ||
            (selectedTheme === "system" && getSystemTheme() === "dark")
          }
          onClick={() =>
            setSelectedTheme(selectedTheme === "light" ? "dark" : "light")
          }
          disabled={selectedTheme === "system"}
        />
      </div>
      <div className="flex flex-row justify-between items-center">
        <p>Use System Theme</p>
        <Toggle
          value={selectedTheme === "system"}
          onClick={() =>
            setSelectedTheme(
              selectedTheme === "system" ? getSystemTheme() : "system",
            )
          }
        />
      </div>
    </HeaderArea>
  );
}
