"use client";
import { api, LobbyGame, fetchGamesList, socketMessageListener } from "@/api";
import { AxiosError } from "axios";
import { useEffect, useState } from "react";
import { useRecoilState } from "recoil";
import {
  listOfGames,
  createGameError,
  gameModalOpen,
  selectedGame,
  player,
  socketData as sd,
} from "@/state/atom";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import NewGameModal from "@/components/newGameModal";
import { useRouter } from "next/navigation";
import { isEmpty } from "@/lib/utils";
import { toast } from "sonner";

export default function Home() {
  const [games, setGames] = useRecoilState<LobbyGame[]>(listOfGames);
  const [gameError, setGameError] = useRecoilState(createGameError);
  const [openModal, setOpenModal] = useRecoilState(gameModalOpen);
  const [selectedGameInfo, setSelectedGameInfo] = useRecoilState(selectedGame);
  const [currentPlayer, setCurrentPlayer] = useRecoilState(player);
  const [socketData, setSocketData] = useRecoilState(sd);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const router = useRouter();

  useEffect(() => {
    console.log("socketData -> ", socketData);
    if (!isEmpty(socketData)) {
      if (
        !isEmpty(socketData.payload) &&
        socketData.payload?.players &&
        socketData.payload?.players.includes(currentPlayer)
      ) {
        router.push("/game/" + socketData.id);
      }
    }
    setIsLoading(true);
    fetchGamesList().then((gameList) => {
      setGames(gameList);
      setIsLoading(false);
    });
  }, [socketData]);

  useEffect(() => {
    if (games.length > 0) {
      setSelectedGameInfo(games[0]);
    }
  }, [games]);

  useEffect(() => {
    socketMessageListener(setSocketData);
  });

  const joinGame = async (gameId: string) => {
    try {
      await api.playerJoin(gameId);
      router.push("/game/" + gameId);
    } catch (error: any) {
      console.error("Error joining game:", error);
      toast.error(error.message);
    }
  };

  return (
    <main className="flex flex-col items-center w-full p-4">
      <h1 className="text-2xl font-bold mb-4">Game List</h1>
      <Button onClick={() => setOpenModal(true)}>Create Game</Button>
      {isLoading ? (
        <p>Loading games...</p>
      ) : games.length === 0 ? (
        <p>No games available.</p>
      ) : (
        <div className="flex flex-row w-full">
          <ScrollArea className="w-3/4 p-4">
            {games.map((game, idx) => (
              <div key={idx}>
                <Button
                  variant="ghost"
                  className="text-xl font-semibold w-full"
                  onClick={() => setSelectedGameInfo(game)}
                >
                  {game.name}
                </Button>
                <Separator />
              </div>
            ))}
          </ScrollArea>
          {selectedGameInfo && (
            <div className="w-1/4">
              <p>{selectedGameInfo.name}</p>
              <p>Player Count: {selectedGameInfo.player_count}</p>
              <p>Question Count: {selectedGameInfo.question_count}</p>
              <p>State: {selectedGameInfo.state}</p>
              <Button onClick={() => joinGame(selectedGameInfo.id)}>
                Join Game
              </Button>
            </div>
          )}
        </div>
      )}
      <NewGameModal isOpen={openModal} />
    </main>
  );
}
