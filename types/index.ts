export interface User {
  xp: number;
  level: number;
  coins: number;
  currentStreak: number;
  maxStreak: number;
  lastPlayedDate: string | null;
  unlockedAchievements: string[];
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  rewardXP: number;
  rewardCoins: number;
}

export type GameStatus = "idle" | "playing" | "paused" | "game_over";

export interface GameState {
  score: number;
  timeLeft: number;
  comboMultiplier: number;
  status: GameStatus;
}
