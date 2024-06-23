"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useRecoilValue } from "recoil";
import { player } from "@/state/atom";

export default function RouteGuard({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const playerName = useRecoilValue(player);
  console.log("playerName -> ", playerName);

  useEffect(() => {
    if (!playerName) {
      console.log("RouteGuard - Redirecting to /");
      router.push("/");
    }
  }, [playerName, router]);
  return <>{children}</>;
}
