import axios, { Axios, AxiosInstance } from "axios";
import { v4 as uuidv4 } from "uuid";

export interface LobbyGame {
  id: string;
  name: string;
  player_count: number;
  question_count: number;
  state: "waiting" | "countdown" | "question" | "ended";
}

export interface LeaderboardEntry {
  username: string;
  score: number;
}

export interface PlayerCommand {
  nonce: string;
  payload: any;
  type: string;
}

export interface PlayerCommandCreate extends PlayerCommand {
  payload: {
    name: string;
    question_count: number;
  };
}

export interface PlayerCommandJoin extends PlayerCommand {
  payload: {
    game_id: string;
  };
}

export interface PlayerCommandReady extends PlayerCommand {
  payload: {
    game_id: string;
  };
}

export interface PlayerCommandStart extends PlayerCommand {
  payload: {
    game_id: string;
  };
}

export interface PlayerCommandAnswer extends PlayerCommand {
  payload: {
    game_id: string;
    index: number;
    question_id: string;
  };
}

export interface PlayerEvent {
  player: string;
  type: string;
  payload: any;
}

export interface GameEvent {
  id: string;
  type: string;
  payload: any;
}

export interface PlayerScore {
  name: string;
  score: number;
}

export class Api {
  url: string;
  client: AxiosInstance;
  socket: WebSocket | null = null;
  socketOpenPromise: Promise<void> | null = null;

  constructor(url: string) {
    if (url.endsWith("/")) {
      url = url.slice(0, -1);
    }

    this.url = url;
    this.client = axios.create({
      baseURL: url,
      headers: { "Content-Type": "application/json" },
    });
  }

  connectWebSocket = (name: string): Promise<void> => {
    if (this.socket) {
      console.warn("WebSocket is already connected.");
      return Promise.resolve();
    }

    this.socket = new WebSocket(`ws://localhost:8080/connect?name=${name}`);

    this.socketOpenPromise = new Promise((resolve, reject) => {
      this.socket!.onopen = (event) => {
        console.log("WebSocket is connected.");
        resolve();
      };

      this.socket!.onmessage = (event) => {
        console.log("Message from server ", event.data);
      };

      this.socket!.onerror = (error) => {
        console.error("WebSocket error observed:", error);
        reject(error);
      };

      this.socket!.onclose = (event) => {
        console.log("WebSocket is closed now.");
        this.socket = null; // Reset the socket so it can be reconnected if needed
      };
    });

    return this.socketOpenPromise;
  };

  fetchGameList = async (): Promise<LobbyGame[]> => {
    try {
      const response = await this.client.get("/games");
      if (response.status != 200) {
        throw new Error("Failed to fetch game list");
      }
      return response.data as LobbyGame[];
    } catch (error) {
      console.error("Error fetching game list:", error);
      throw error;
    }
  };

  fetchLeaderboard = async (): Promise<LeaderboardEntry[]> => {
    try {
      const response = await this.client.get("/leaderboard");
      if (response.status != 200) {
        throw new Error("Failed to fetch the leaderboard");
      }
      return response.data as LeaderboardEntry[];
    } catch (error) {
      console.error("Error fetching the leaderboard:", error);
      throw error;
    }
  };

  createGame = async (name: string, questionCount: number): Promise<void> => {
    const command: PlayerCommandCreate = {
      nonce: uuidv4(),
      type: "create",
      payload: {
        name,
        question_count: questionCount,
      },
    };

    console.log("this.socket -> ", this.socket);
    console.log("this.socketOpenPromise -> ", this.socketOpenPromise);

    try {
      if (!this.socket || !this.socketOpenPromise) {
        throw new Error("Socket is not initialized");
      }

      await this.socketOpenPromise; // Wait for the socket to be open

      console.log("create game command -> ", command);
      console.log("nonce type -> ", typeof command.nonce);
      this.socket.send(JSON.stringify(command)); // Send as string
    } catch (error) {
      console.error("Error creating game:", error);
      throw error;
    }
  };
}

export const api = new Api("http://localhost:8080/");
