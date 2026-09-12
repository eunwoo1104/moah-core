"use client";

import { AnimatePresence } from "motion/react";
import Link from "next/link";
import { useContext, useEffect, useRef, useState } from "react";

import { SessionContext } from "@/utils/contexts";
import { icons } from "@/utils/icons";

import { HeaderArea } from "./HeaderArea";
import { HeaderCircle } from "./HeaderCircle";
import { LoginArea } from "./LoginArea";
import { SettingArea } from "./SettingArea";
import { UserArea } from "./UserArea";

const HelpArea: React.FC = () => (
  <HeaderArea className="md:w-fit font-bold text-2xl text-center">
    soonTM
  </HeaderArea>
);

export default function Header() {
  const [openArea, setOpenArea] = useState<string | null>(null);
  const [mobileOpen, setMobileOpen] = useState<boolean>(false);
  const areaRef = useRef<HTMLDivElement | null>(null);
  const areaButtonRef = useRef<HTMLDivElement | null>(null);
  const mobileMenuRef = useRef<HTMLButtonElement | null>(null);
  const sessionCtx = useContext(SessionContext);

  const changeAreaStatus = (areaName: string | null) => {
    setOpenArea(openArea !== areaName ? areaName : null);

    // get TailwindCSS md breakpoint
    const rootStyles = getComputedStyle(document.documentElement);
    const mdBreakpoint = rootStyles.getPropertyValue("--breakpoint-md").trim();

    const isMobile = window.matchMedia(`(max-width: ${mdBreakpoint})`).matches;

    setMobileOpen(isMobile ? true : !openArea);
  };

  useEffect(() => {
    if (!openArea && !mobileOpen) return;

    const handlePointerDown = (e: PointerEvent) => {
      const target = e.target;
      if (!(target instanceof Node)) return;

      const clickedButtons = areaButtonRef.current?.contains(target) ?? false;
      const clickedArea = areaRef.current?.contains(target) ?? false;
      const clickedMobileMenu =
        mobileMenuRef.current?.contains(target) ?? false;

      if (clickedButtons || clickedArea || clickedMobileMenu) return;

      setOpenArea(null);
      setMobileOpen(false);
    };

    document.addEventListener("pointerdown", handlePointerDown);
    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
    };
  }, [openArea, mobileOpen]);

  return (
    <div>
      <div
        className="fixed top-0 left-0 right-0 z-30 px-8 pb-6 pt-5 flex flex-row items-center transition-colors duration-300
        before:absolute before:inset-0 before:-z-10 before:backdrop-blur-xs
        before:mask-[linear-gradient(to_bottom,black_65%,transparent)]"
      >
        <div className="flex flex-row items-center space-x-3">
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
        </div>
        <div className="flex-1" />
        <HeaderCircle
          className="md:hidden"
          onClick={() => setMobileOpen(!mobileOpen)}
          ref={mobileMenuRef}
        >
          {icons.menu}
        </HeaderCircle>
        {/* TODO: animation on mobile menu open (probably need to completely change structure) */}
        <div
          className={`${mobileOpen || openArea ? "flex fixed top-0 right-0 mt-19 mr-8" : "hidden"}
          md:static md:m-0 md:flex md:flex-row flex-col justify-center items-center space-y-3 md:space-y-0 md:space-x-3
          rounded-full md:bg-transparent transition-colors duration-300 backdrop-blur-xs md:backdrop-blur-none`}
          ref={areaButtonRef}
        >
          <HeaderCircle onClick={() => changeAreaStatus("help")}>
            {icons.help}
          </HeaderCircle>
          <HeaderCircle onClick={() => changeAreaStatus("setting")}>
            {icons.setting}
          </HeaderCircle>
          <HeaderCircle onClick={() => changeAreaStatus("login")}>
            {
              sessionCtx?.user
                ? icons.user
                : icons.login /* TODO: show avatar if avatar is set */
            }
          </HeaderCircle>
        </div>
      </div>
      <div ref={areaRef}>
        <AnimatePresence>
          {openArea === "help" ? (
            <HelpArea />
          ) : openArea === "setting" ? (
            <SettingArea />
          ) : openArea === "login" ? (
            sessionCtx?.user ? (
              <UserArea />
            ) : (
              <LoginArea />
            )
          ) : null}
        </AnimatePresence>
      </div>
    </div>
  );
}
