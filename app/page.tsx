"use client";
import { Api, LobbyGame } from "@/api";
import { AxiosError } from "axios";
import { useEffect, useState } from "react";

const api = new Api("http://localhost:8080/");

export default function Home() {
  const [games, setGames] = useState<LobbyGame[]>([]);
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
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <h1 className="text-2xl font-bold mb-4">Game List</h1>
      {isLoading ? (
        <p>Loading games...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : games.length === 0 ? (
        <p>No games available.</p>
      ) : (
        <ul className="space-y-2">
          {games.map((game) => (
            <li key={game.id} className="bg-gray-100 p-4 rounded">
              <h2 className="text-xl font-semibold">{game.name}</h2>
              <p>Question Count: {game.questionCount}</p>
              <p>State: {game.state}</p>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
