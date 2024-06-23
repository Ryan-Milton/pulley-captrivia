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
      <main className="flex min-h-screen flex-col items-center p-24">
        {children}
      </main>
    </>
  );
}
