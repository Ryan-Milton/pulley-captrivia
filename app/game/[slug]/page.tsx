"use client";
import { LobbyGame, api, fetchGamesList, socketMessageListener } from "@/api";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import {
  selectedGame,
  currentPlayer,
  socketData as sd,
  listOfGames,
  currentQuestion as question,
} from "@/state/atom";
import { useRouter } from "next/navigation";
import { isEmpty, deepEqual } from "@/lib/utils";
import { toast } from "sonner";
import { Separator } from "@/components/ui/separator";

export default function Game({ params }: { params: { slug: string } }) {
  const currentPlayer = useRecoilValue(currentPlayer);
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
    <div className="flex flex-col items-center w-full p-4">
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
      {selectedGameInfo.state === "countdown" && (
        <div>
          <p className="text-2xl font-bold">Countdown</p>
          <p>State: {selectedGameInfo.state}</p>
        </div>
      )}
      {selectedGameInfo.state === "question" && (
        <div>
          <div>
            <p className="text-xl font-bold">{currentQuestion.question}</p>
            <div className=" grid grid-cols-2 gap-4">
              {currentQuestion.options.map((option, idx) => (
                <Button
                  key={idx}
                  variant="outline"
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
              ))}
            </div>
          </div>
        </div>
      )}
      {selectedGameInfo.state === "ended" && (
        <div>
          <p className="text-2xl font-bold">Scores!</p>
          <div>
            {score.map((playerScore, idx) => (
              <div>
                <div className="flex flex-row" key={idx}>
                  <p className="flex-1">{playerScore.name}</p>
                  <p>{playerScore.score}</p>
                </div>
                <Separator />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
