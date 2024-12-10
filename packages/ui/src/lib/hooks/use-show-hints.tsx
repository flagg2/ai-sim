import { create } from "zustand";
import { persist } from "zustand/middleware";

interface ShowHintsState {
  actionCount: number;
  incrementActionCount: () => void;
  shouldShowHints: () => boolean;
  resetActionCount: () => void;
}

const HINTS_THRESHOLD = 3;

export const useShowHints = create<ShowHintsState>()(
  persist(
    (set, get) => ({
      actionCount: 0,
      incrementActionCount: () =>
        set((state) => ({ actionCount: state.actionCount + 1 })),
      shouldShowHints: () => get().actionCount <= HINTS_THRESHOLD,
      resetActionCount: () => set({ actionCount: 0 }),
    }),
    {
      name: "hints-storage",
    },
  ),
);
