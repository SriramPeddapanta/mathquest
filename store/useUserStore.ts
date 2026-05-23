import { create } from "zustand";
import { persist } from "zustand/middleware";
import { User } from "@/types";

interface UserStore extends User {
  playerName: string | null;
  setPlayerName: (name: string) => void;
  addXP: (amount: number) => void;
  addCoins: (amount: number) => void;
  spendCoins: (amount: number) => boolean;
  unlockAchievement: (id: string) => void;
  incrementStreak: () => void;
  resetStreak: () => void;
}

export const useUserStore = create<UserStore>()(
  persist(
    (set, get) => ({
      playerName: null,
      xp: 0,
      level: 1,
      coins: 0,
      currentStreak: 0,
      maxStreak: 0,
      lastPlayedDate: null,
      unlockedAchievements: [],

      setPlayerName: (name) => set({ playerName: name }),

      addXP: (amount) =>
        set((state) => {
          const newXP = state.xp + amount;
          const newLevel = Math.floor(newXP / 1000) + 1;
          return { xp: newXP, level: newLevel };
        }),

      addCoins: (amount) => set((state) => ({ coins: state.coins + amount })),

      spendCoins: (amount) => {
        const { coins } = get();
        if (coins >= amount) {
          set({ coins: coins - amount });
          return true;
        }
        return false;
      },

      unlockAchievement: (id) =>
        set((state) => {
          if (!state.unlockedAchievements.includes(id)) {
            return {
              unlockedAchievements: [...state.unlockedAchievements, id],
            };
          }
          return state;
        }),

      incrementStreak: () =>
        set((state) => {
          const today = new Date().toISOString().split("T")[0];
          if (state.lastPlayedDate === today) return state; // Already played today

          const yesterday = new Date();
          yesterday.setDate(yesterday.getDate() - 1);
          const yesterdayStr = yesterday.toISOString().split("T")[0];

          let newStreak = 1;
          if (state.lastPlayedDate === yesterdayStr) {
            newStreak = state.currentStreak + 1;
          }

          return {
            currentStreak: newStreak,
            maxStreak: Math.max(state.maxStreak, newStreak),
            lastPlayedDate: today,
          };
        }),

      resetStreak: () => set({ currentStreak: 0 }),
    }),
    {
      name: "math-game-user-storage",
    }
  )
);
