"use client";
import Navbar from "@/components/navbar";

export default function GamesLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <Navbar />
      <main className="flex flex-1 flex-col items-center">{children}</main>
    </>
  );
}
