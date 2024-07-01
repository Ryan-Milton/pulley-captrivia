"use client";
import { LobbyGame, api, fetchGamesList, socketMessageListener } from "@/api";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { useRecoilState } from "recoil";
import { selectedGame, socketData as sd, listOfGames } from "@/state/atom";
import { useRouter } from "next/navigation";
import { isEmpty, deepEqual } from "@/lib/utils";

export default function Game({ params }: { params: { slug: string } }) {
  const [selectedGameInfo, setSelectedGameInfo] = useRecoilState(selectedGame);
  const [games, setGames] = useRecoilState<LobbyGame[]>(listOfGames);
  const [socketData, setSocketData] = useRecoilState(sd);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [playersInGame, setPlayersInGame] = useState<string[]>([]);

  useEffect(() => {
    socketMessageListener(setSocketData);
  });

  useEffect(() => {
    console.log("socketData -> ", socketData);
    setIsLoading(true);
    fetchGamesList().then((gameList) => {
      setGames(gameList);
      setIsLoading(false);
    });
  }, [socketData]);

  // match id of selectedGameInfo to matching game in games[]
  useEffect(() => {
    console.log("selectedGameInfo -> ", selectedGameInfo);
    console.log("games -> ", games);
    console.log("socketData -> ", socketData);
    if (selectedGameInfo && games.length > 0) {
      const matchingGame = games.find(
        (game) => game.id === selectedGameInfo.id
      );
      if (matchingGame && !deepEqual(matchingGame, selectedGameInfo)) {
        setSelectedGameInfo(matchingGame);
      }
    }
  }, [selectedGameInfo, games]);

  return (
    <div>
      <p className="text-2xl font-bold">{selectedGameInfo.name}</p>
      <p>Player Count: {selectedGameInfo.player_count}</p>
      <p>Question Count: {selectedGameInfo.question_count}</p>
      <p>State: {selectedGameInfo.state}</p>
      <Button onClick={() => api.playerReady(params.slug)}>Ready Up!</Button>
    </div>
  );
}
