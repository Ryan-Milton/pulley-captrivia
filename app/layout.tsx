import type { Metadata } from "next";
import "./globals.css";
import { Inter as FontSans } from "next/font/google";
import RecoilContextProvider from "@/lib/RecoilContextProvider";
import RouteGuard from "@/lib/routeGuard";
import { Toaster } from "@/components/ui/sonner";
import { ThemeProvider } from "@/components/theme-provider";

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
          "flex flex-1 flex-col min-h-screen bg-background font-sans antialiased",
          fontSans.variable
        )}
      >
        <ThemeProvider attribute="class">
          <RecoilContextProvider>
            <RouteGuard>{children}</RouteGuard>
          </RecoilContextProvider>
          <Toaster richColors />
        </ThemeProvider>
      </body>
    </html>
  );
}
