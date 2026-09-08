"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";

import { motion, AnimatePresence, HTMLMotionProps } from "motion/react";

import { icons } from "@/utils/icons";
import Toggle from "@/components/Toggle";

const HeaderCircle: React.FC<{
  className?: string;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  children: React.ReactNode;
}> = ({ className, onClick, children, ...props }) => (
  <button
    className={`clickable circle-icon bg-neutral-200 dark:bg-neutral-850 h-12 w-12 ${className}`}
    onClick={onClick}
    {...props}
  >
    {children}
  </button>
);

const HeaderArea: React.FC<HTMLMotionProps<"div">> = ({
  className,
  children,
  ...props
}) => (
  <motion.div
    className={`bg-neutral-200 dark:bg-neutral-850 fixed top-0 right-0 left-0 md:left-auto z-30 mt-19 ml-8 mr-8 p-4 rounded-lg ${className}`}
    initial={{ opacity: 0, y: -15 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -15 }}
    transition={{ duration: 0.1 }}
    {...props}
  >
    {children}
  </motion.div>
);

// TODO: responsive design

const SettingArea: React.FC = () => {
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
      <p className="font-bold text-sm text-neutral-400">Theme Setting</p>
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
};

const LoginArea: React.FC = () => {
  const onSubmit = (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
  };
  return (
    <HeaderArea className="md:w-96">
      <form className="space-y-1" onSubmit={onSubmit}>
        <label>
          Email
          <input
            name="email"
            type="email"
            placeholder="user@example.com"
            autoComplete="email"
          />
        </label>
        <label>
          Password
          <input
            name="password"
            type="password"
            placeholder="password"
            autoComplete="current-password"
          />
        </label>
        <div className="flex flex-col-reverse md:flex-row items-center mt-2 space-x-0 md:space-x-2 space-y-1 md:space-y-0">
          <div className="flex flex-row items-center space-x-2 text-neutral-400">
            <button className="clickable">Reset Password</button>
          </div>
          <div className="md:flex-1" />
          <Link
            href="/user/register"
            className="clickable dark:bg-neutral-800 rounded-lg py-1 w-full md:w-20 text-center"
          >
            Register
          </Link>
          <input
            className="clickable dark:bg-neutral-800 rounded-lg py-1 w-full md:w-20 mb-2 md:mb-0"
            type="submit"
            value="Login"
          />
        </div>
      </form>
    </HeaderArea>
  );
};

export default function Header() {
  const [openArea, setOpenArea] = useState<string | null>(null);
  const areaRef = useRef<HTMLDivElement | null>(null);
  const areaButtonRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!openArea) return;

    const handlePointerDown = (e: PointerEvent) => {
      const target = e.target as Node;

      const clickedButtons = areaButtonRef.current?.contains(target);
      const clickedArea = areaRef.current?.contains(target);

      if (!clickedButtons && !clickedArea) {
        setOpenArea(null);
      }
    };

    document.addEventListener("pointerdown", handlePointerDown);
    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
    };
  }, [openArea]);

  return (
    <div>
      <div
        className="fixed top-0 left-0 right-0 z-30 px-8 pb-6 pt-5 flex flex-row items-center space-x-3 transition-colors duration-300
        before:absolute before:inset-0 before:-z-10 before:backdrop-blur-xs
        before:mask-[linear-gradient(to_bottom,black_65%,transparent)]"
      >
        <Link href="/" className="font-bold text-4xl clickable">
          MoAh
        </Link>
        <HeaderCircle
          className="ml-2"
          onClick={() => {
            alert("Hello, World!");
          }}
        >
          {icons.list}
        </HeaderCircle>
        <HeaderCircle>{icons.search}</HeaderCircle>
        <div className="flex-1" />
        <div
          className="flex flex-row items-center space-x-3"
          ref={areaButtonRef}
        >
          <HeaderCircle>{icons.help}</HeaderCircle>
          <HeaderCircle
            onClick={() =>
              setOpenArea(openArea !== "setting" ? "setting" : null)
            }
          >
            {icons.setting}
          </HeaderCircle>
          <HeaderCircle
            onClick={() => setOpenArea(openArea !== "login" ? "login" : null)}
          >
            {icons.login}
          </HeaderCircle>
        </div>
      </div>
      <div ref={areaRef}>
        <AnimatePresence>
          {openArea === "setting" ? (
            <SettingArea />
          ) : openArea === "login" ? (
            <LoginArea />
          ) : null}
        </AnimatePresence>
      </div>
    </div>
  );
}
