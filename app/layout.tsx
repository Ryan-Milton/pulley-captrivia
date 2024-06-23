import type { Metadata } from "next";
import "./globals.css";
import { Inter as FontSans } from "next/font/google";
import RecoilContextProvider from "@/lib/RecoilContextProvider";
import RouteGuard from "@/lib/routeGuard";

export const metadata: Metadata = {
  title: "CapTrivia!",
  description: "The trivia game all about Cap Tables!",
};

import { cn } from "@/lib/utils";
const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={cn(
          "min-h-screen bg-background font-sans antialiased",
          fontSans.variable
        )}
      >
        <RecoilContextProvider>
          <RouteGuard>{children}</RouteGuard>
        </RecoilContextProvider>
      </body>
    </html>
  );
}
