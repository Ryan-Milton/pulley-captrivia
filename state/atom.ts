import { atom } from "recoil";
import { LobbyGame } from "@/api";

export const listOfGames = atom({
  key: "games",
  default: <LobbyGame[]>[],
});

export const player = atom({
  key: "player",
  default: "",
});

export const openPlayerModal = atom({
  key: "openPlayerModal",
  default: false,
});
