"use client";
import { api, LobbyGame } from "@/api";
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

export default function Home() {
  const [games, setGames] = useRecoilState<LobbyGame[]>(listOfGames);
  const [gameError, setGameError] = useRecoilState(createGameError);
  const [openModal, setOpenModal] = useRecoilState(gameModalOpen);
  const [selectedGameInfo, setSelectedGameInfo] = useRecoilState(selectedGame);
  const [currentPlayer, setCurrentPlayer] = useRecoilState(player);
  const [socketData, setSocketData] = useRecoilState(sd);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const router = useRouter();

  const fetchGames = async () => {
    try {
      const gameList = await api.fetchGameList();
      setGames(gameList);
      setIsLoading(false);
    } catch (error) {
      if (error instanceof AxiosError) {
        setError("Failed to fetch game list: " + error.message);
      } else {
        console.error(
          "An unknown error occurred while fetching the game list:",
          error
        );
        setError("An unknown error occurred. Please try again later.");
      }
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchGames();
  }, [socketData]);

  useEffect(() => {
    if (games.length > 0) {
      setSelectedGameInfo(games[0]);
    }
  }, [games]);

  console.log("games -> ", games);

  if (api.socket) {
    api.socket!.onmessage = (event) => {
      console.log("event.data into JSON -> ", JSON.parse(event.data));
      const data = JSON.parse(event.data);
      console.log("data.payload -> ", data.payload);
      setSocketData(data);
      if (
        !isEmpty(data.payload) &&
        data.payload?.players &&
        data.payload?.players.includes(currentPlayer)
      ) {
        console.log("navigating to game page");
        router.push("/game/" + data.id);
      }
    };
  }

  const joinGame = async (gameId: string) => {
    try {
      await api.playerJoin(gameId);
      router.push("/game/" + gameId);
    } catch (error) {
      console.error("Error joining game:", error);
    }
  };

  console.log("selectedGameInfo -> ", selectedGameInfo);

  return (
    <main className="flex flex-col items-center w-full p-4">
      <h1 className="text-2xl font-bold mb-4">Game List</h1>
      <Button onClick={() => setOpenModal(true)}>Create Game</Button>
      {isLoading ? (
        <p>Loading games...</p>
      ) : error ? (
        <div className="max-w-lg">
          <code className="relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm">
            {error}
          </code>
        </div>
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
