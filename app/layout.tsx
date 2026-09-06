import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Moah",
  description: "Self-hosted media manager",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className="">
      <body className="">{children}</body>
    </html>
  );
}
