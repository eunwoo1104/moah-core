"use client";

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
export default function Header() {
  //
  return (
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
      <HeaderCircle>{icons.login}</HeaderCircle>
    </div>
  );
}
