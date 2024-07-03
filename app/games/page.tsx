"use client";
import { api, LobbyGame, fetchGamesList, socketMessageListener } from "@/api";
import { AxiosError } from "axios";
import { use, useEffect, useState } from "react";
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
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { LoaderCircle } from "lucide-react";

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
    setIsLoading(true);
    fetchGamesList().then((gameList) => {
      console.log("gameList -> ", gameList);
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

  console.log("selectedGameInfo ->", selectedGameInfo);
  console.log("socketData ->", socketData);

  return (
    <main className="flex flex-1 flex-col items-center w-full p-4">
      <h1 className="text-5xl font-bold mb-4">Game List</h1>
      <div className="flex flex-1 flex-row w-full">
        <ScrollArea className="w-3/4 p-4">
          <Table>
            {games.length === 0 ? (
              <TableBody>
                <TableRow className=" hover:bg-transparent dark:hover:bg-transparent">
                  <TableCell className="text-center text-xl">
                    No games available.
                  </TableCell>
                </TableRow>
                <TableRow className=" hover:bg-transparent dark:hover:bg-transparent">
                  <TableCell className="text-center text-xl">
                    <Button onClick={() => setOpenModal(true)}>
                      Create Game
                    </Button>
                  </TableCell>
                </TableRow>
              </TableBody>
            ) : (
              <>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-left">Game Name</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {games.map((game, idx) => (
                    <TableRow
                      key={idx}
                      className="hover:cursor-pointer"
                      onClick={() => setSelectedGameInfo(game)}
                    >
                      <TableCell className="text-left">{game.name}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </>
            )}
          </Table>
        </ScrollArea>
        <div className="flex flex-col w-1/4 justify-between">
          {games.length > 0 && selectedGameInfo && (
            <>
              <Card className="w-full">
                <CardHeader>
                  <CardTitle>{selectedGameInfo.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableBody>
                      <TableRow className="hover:bg-transparent dark:hover:bg-transparent">
                        <TableCell className="text-left">Players</TableCell>
                        <TableCell className="text-right">
                          {selectedGameInfo.player_count}
                        </TableCell>
                      </TableRow>
                      <TableRow className="hover:bg-transparent dark:hover:bg-transparent">
                        <TableCell className="text-left">Questions</TableCell>
                        <TableCell className="text-right">
                          {selectedGameInfo.question_count}
                        </TableCell>
                      </TableRow>
                      <TableRow className="hover:bg-transparent dark:hover:bg-transparent">
                        <TableCell className="text-left">State</TableCell>
                        <TableCell className="text-right">
                          {selectedGameInfo.state}
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </CardContent>
                <CardFooter>
                  {socketData.payload?.players &&
                  socketData.payload?.players.includes(currentPlayer)
                    ? selectedGameInfo.state !== "ended" && (
                        <Button
                          className="w-full"
                          onClick={() =>
                            router.push("/game/" + selectedGameInfo.id)
                          }
                        >
                          Enter
                        </Button>
                      )
                    : selectedGameInfo.state !== "ended" && (
                        <Button
                          className="w-full"
                          onClick={() => joinGame(selectedGameInfo.id)}
                        >
                          Join Game
                        </Button>
                      )}
                </CardFooter>
              </Card>
              <Button onClick={() => setOpenModal(true)}>Create Game</Button>
            </>
          )}
        </div>
      </div>
      <NewGameModal isOpen={openModal} />
    </main>
  );
}
