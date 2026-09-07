"use client";

import { useState } from "react";

import { motion, AnimatePresence } from "motion/react";

import Link from "next/link";
import { icons } from "@/utils/icons";

const HeaderCircle: React.FC<{
  className?: string;
  onClick?: React.MouseEventHandler<HTMLParagraphElement>;
  children: React.ReactNode;
}> = ({ className, onClick, children }) => (
  <div
    className={`clickable circle-icon bg-neutral-850 h-12 w-12 ${className}`}
    onClick={onClick}
  >
    {children}
  </div>
);

// TODO: responsive design

const LoginArea: React.FC = () => {
  const onSubmit = (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
  };
  return (
    <motion.div
      className="bg-neutral-850 md:w-96 fixed top-0 right-0 left-0 md:left-auto z-30 mt-19 ml-8 mr-8 p-3 rounded-lg"
      initial={{ opacity: 0, y: -15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      transition={{ duration: 0.1 }}
    >
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
    </motion.div>
  );
};

export default function Header() {
  const [openLogin, setOpenLogin] = useState<boolean>(false);

  return (
    <div>
      <div
        className="fixed top-0 left-0 right-0 z-30 px-8 pb-6 pt-5 flex flex-row items-center space-x-3 transition-colors duration-300 rounded-lg
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
        <HeaderCircle>{icons.help}</HeaderCircle>
        <HeaderCircle>{icons.setting}</HeaderCircle>
        <HeaderCircle onClick={() => setOpenLogin(!openLogin)}>
          {icons.login}
        </HeaderCircle>
      </div>
      <AnimatePresence>{openLogin && <LoginArea />}</AnimatePresence>
    </div>
  );
}
