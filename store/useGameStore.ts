import { create } from "zustand";
import { GameState, GameStatus } from "@/types";

interface GameStore extends GameState {
  startGame: (initialTime: number) => void;
  endGame: () => void;
  addScore: (points: number) => void;
  decrementTime: () => void;
  increaseMultiplier: () => void;
  resetMultiplier: () => void;
  pauseGame: () => void;
  resumeGame: () => void;
  quitGame: () => void;
}

export const useGameStore = create<GameStore>((set, get) => ({
  score: 0,
  timeLeft: 60,
  comboMultiplier: 1,
  status: "idle",

  startGame: (initialTime) =>
    set({
      score: 0,
      timeLeft: initialTime,
      comboMultiplier: 1,
      status: "playing",
    }),

  endGame: () => set({ status: "game_over" }),
  
  pauseGame: () => set({ status: "paused" }),
  
  resumeGame: () => set({ status: "playing" }),
  
  quitGame: () => set({ status: "idle" }),

  addScore: (points) =>
    set((state) => ({
      score: state.score + points * state.comboMultiplier,
    })),

  decrementTime: () =>
    set((state) => {
      if (state.timeLeft <= 1) {
        return { timeLeft: 0, status: "game_over" };
      }
      return { timeLeft: state.timeLeft - 1 };
    }),

  increaseMultiplier: () =>
    set((state) => ({
      comboMultiplier: Math.min(state.comboMultiplier + 0.5, 5), // Max 5x multiplier
    })),

  resetMultiplier: () => set({ comboMultiplier: 1 }),
}));
