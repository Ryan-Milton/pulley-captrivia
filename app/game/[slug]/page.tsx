"use client";
import { LobbyGame, api, fetchGamesList, socketMessageListener } from "@/api";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import {
  selectedGame,
  player,
  socketData as sd,
  listOfGames,
  currentQuestion as question,
} from "@/state/atom";
import { useRouter } from "next/navigation";
import { isEmpty, deepEqual } from "@/lib/utils";
import { toast } from "sonner";
import { Separator } from "@/components/ui/separator";
import CountdownBar from "@/components/CountdownBar";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default function Game({ params }: { params: { slug: string } }) {
  const currentPlayer = useRecoilValue(player);
  const [selectedGameInfo, setSelectedGameInfo] = useRecoilState(selectedGame);
  const [games, setGames] = useRecoilState<LobbyGame[]>(listOfGames);
  const [socketData, setSocketData] = useRecoilState(sd);
  const [currentQuestion, setCurrentQuestion] = useRecoilState(question);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [readiedUp, setReadiedUp] = useState<boolean>(false);
  const [score, setScore] = useState<any>([]);

  useEffect(() => {
    socketMessageListener(setSocketData);
  });

  useEffect(() => {
    if (!isEmpty(socketData)) {
      if (socketData.error) {
        toast.error(socketData.error);
      }
      switch (socketData.type) {
        case "game_question":
          setCurrentQuestion({
            id: socketData.payload.id,
            options: socketData.payload.options,
            question: socketData.payload.question,
            seconds: socketData.payload.seconds,
          });
          break;
        case "game_player_correct":
          if (socketData.payload.player === currentPlayer) {
            toast.success("Correct!");
          }
          break;
        case "game_player_incorrect":
          if (socketData.payload.player === currentPlayer) {
            toast.error("Incorrect!");
          }
          break;
        case "game_end":
          setScore(socketData.payload.scores);
          break;
      }
    }
  }, [socketData]);

  useEffect(() => {
    setIsLoading(true);
    fetchGamesList().then((gameList) => {
      setGames(gameList);
      setIsLoading(false);
    });
  }, [socketData]);

  // match id of selectedGameInfo to matching game in games[]
  useEffect(() => {
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
    <div className="flex flex-col items-center w-full p-4 gap-4">
      <p className="text-5xl font-bold">{selectedGameInfo.name}</p>
      {selectedGameInfo.state === "waiting" && (
        <div>
          <p>Player Count: {selectedGameInfo.player_count}</p>
          <p>Question Count: {selectedGameInfo.question_count}</p>
          <p>State: {selectedGameInfo.state}</p>
          {!readiedUp && (
            <Button
              onClick={() => {
                api.playerReady(selectedGameInfo.id);
                setReadiedUp(true);
              }}
            >
              Ready Up!
            </Button>
          )}
          <Button onClick={() => api.playerStart(selectedGameInfo.id)}>
            Start!
          </Button>
        </div>
      )}
      {selectedGameInfo.state === "question" && (
        <div>
          <div className="flex flex-col max-w-lg items-center text-center border border-default-border rounded-lg p-4 gap-4">
            <p className="text-xl font-bold">{currentQuestion.question}</p>
            <CountdownBar seconds={currentQuestion.seconds} />
            <div className=" grid grid-cols-2 gap-4">
              {currentQuestion.options.map((option, idx) => (
                <div className="flex" key={idx}>
                  <Button
                    variant="outline"
                    className="flex-1 text-wrap h-full"
                    onClick={() => {
                      api.playerAnswer(
                        selectedGameInfo.id,
                        idx,
                        currentQuestion.id
                      );
                    }}
                  >
                    {option}
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
      {selectedGameInfo.state === "ended" && (
        <div className="flex flex-col w-full max-w-xs items-center text-center border border-default-border rounded-lg p-4 gap-4">
          <Table>
            <TableCaption className="text-xs">
              Scores are from the previous game played and are accurate and
              final. To make a complaint or to report a mistake, please contact
              the game host.
            </TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead>Player</TableHead>
                <TableHead className="text-right">Score</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {score.map((playerScore, idx) => (
                <TableRow key={idx}>
                  <TableCell className="text-left">
                    {playerScore.name}
                  </TableCell>
                  <TableCell className="text-right">
                    {playerScore.score}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}
