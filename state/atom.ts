import { atom } from "recoil";
import { LobbyGame } from "@/api";

export const listOfGames = atom({
  key: "games",
  default: <LobbyGame[]>[],
});
