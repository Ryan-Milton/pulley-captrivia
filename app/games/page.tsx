"use client";
import { api, LobbyGame } from "@/api";
import { AxiosError } from "axios";
import { useEffect, useState } from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import { listOfGames, createGameError, gameModalOpen } from "@/state/atom";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import NewGameModal from "@/components/newGameModal";

export default function Home() {
  const [games, setGames] = useRecoilState<LobbyGame[]>(listOfGames);
  const [gameError, setGameError] = useRecoilState(createGameError);
  const [openModal, setOpenModal] = useRecoilState(gameModalOpen);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
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

    fetchGames();
  }, []);

  console.log("games -> ", games);

  return (
    <main className="flex flex-col items-center">
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
        <ScrollArea className="max-w-2xl">
          {games.map((game) => (
            <>
              <div key={game.id} className="bg-gray-100 p-4 rounded">
                <h2 className="text-xl font-semibold">{game.name}</h2>
                <p>Question Count: {game.question_count}</p>
                <p>State: {game.state}</p>
              </div>
              <Separator />
            </>
          ))}
        </ScrollArea>
      )}
      <NewGameModal isOpen={openModal} />
    </main>
  );
}
