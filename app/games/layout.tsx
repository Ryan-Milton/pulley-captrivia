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
      <main className="flex flex-col items-center">{children}</main>
    </>
  );
}
