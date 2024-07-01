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

export const game = atom({
  key: "game",
  default: {},
});

export const gameModalOpen = atom({
  key: "gameModalOpen",
  default: false,
});

export const createGameError = atom({
  key: "createGameError",
  default: "",
});

export const selectedGame = atom({
  key: "gameInfo",
  default: <LobbyGame>{},
});

export const socketData = atom({
  key: "socketData",
  default: <any>{},
});
