import { Axios } from "axios";

export interface LobbyGame {
  id: string;
  name: string;
  questionCount: number;
  state: "waiting" | "countdown" | "question" | "ended";
}

export interface LeaderboardEntry {
  username: string;
  score: number;
}

export class Api {
  url: string;
  client: Axios;

  constructor(url: string) {
    if (url.endsWith("/")) {
      url = url.slice(0, -1);
    }

    this.url = url;
    this.client = new Axios({ baseURL: url });
  }

  fetchGameList = async (): Promise<LobbyGame[]> => {
    try {
      const response = await this.client.get("/games");
      if (response.status != 200) {
        throw new Error("Failed to fetch game list");
      }
      return JSON.parse(response.data) as LobbyGame[];
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
      return JSON.parse(response.data) as LeaderboardEntry[];
    } catch (error) {
      console.error("Error fetching the leaderboard:", error);
      throw error;
    }
  };
}
