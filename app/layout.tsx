import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/layout/Header";

export const metadata: Metadata = {
  title: "MoAh",
  description: "Self-hosted media manager",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body className="bg-white dark:bg-neutral-900 dark:text-white w-full min-h-screen">
        {/* Header */}
        <Header />
        {/* Content */}
        <div className="content-mt content-ml content-mr">{children}</div>
      </body>
    </html>
  );
}
