"use client";
import { api } from "@/api";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";

export default function Game({ params }: { params: { slug: string } }) {
  if (api.socket) {
    api.socket!.onmessage = (event) => {
      const data = JSON.parse(event.data);
      console.log("data -> ", data);
    };
  }
  return (
    <div>
      <p className="text-2xl">Game {params.slug}</p>
      <Button onClick={() => api.playerReady(params.slug)}>Ready Up!</Button>
    </div>
  );
}
