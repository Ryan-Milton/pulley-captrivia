"use client";
import { useEffect, useState } from "react";
import { useRecoilState } from "recoil";
import { player, openPlayerModal } from "@/state/atom";
import NewPlayerModal from "@/components/newPlayerModal";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import Navbar from "@/components/navbar";

export default function Home() {
  const [currentPlayer, setCurrentPlayer] = useRecoilState(player);
  const [openModal, setOpenModal] = useRecoilState(openPlayerModal);

  const router = useRouter();

  useEffect(() => {
    if (!currentPlayer) {
      setTimeout(() => {
        setOpenModal(true);
      }, 2500);
    }
    if (currentPlayer) {
      console.log("currentPlayer", currentPlayer);
      setOpenModal(false);
    }
  }, [currentPlayer]);

  function findGames() {
    if (!currentPlayer) {
      setOpenModal(true);
    } else {
      router.push("/games");
    }
  }

  return (
    <>
      {currentPlayer && <Navbar />}
      <main className="flex min-h-screen flex-col items-center p-24">
        <h1 className="text-9xl font-bold mb-4 tracking-tightest">
          CapTrivia!
        </h1>
        <p className="text-2xl font-bold mb-4 tracking-tight">
          The trivia game all about Cap Tables!
        </p>
        <Button onClick={findGames}>Find Games!</Button>
        <NewPlayerModal isOpen={openModal} />
      </main>
    </>
  );
}
