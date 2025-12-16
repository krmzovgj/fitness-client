import type { Diet } from "@/model/diet";
import { create } from "zustand";

type DietStore = {
  mealDaysByClient: Record<string, Diet[]>;
  setMealDays: (clientId: number, mealDays: Diet[]) => void;
};

export const useDietStore = create<DietStore>((set) => ({
  mealDaysByClient: {},
  setMealDays: (clientId, mealDays) =>
    set((state) => ({
      mealDaysByClient: {
        ...state.mealDaysByClient,
        [clientId]: mealDays,
      },
    })),
}));
