import type { Diet } from "@/model/diet";
import { create } from "zustand";

type DietStore = {
    dietDaysByClient: Record<string, Diet[]>;
    setDietDays: (clientId: number, mealDays: Diet[]) => void;
};

export const useDietStore = create<DietStore>((set) => ({
    dietDaysByClient: {},
    setDietDays: (clientId, mealDays) =>
        set((state) => ({
            dietDaysByClient: {
                ...state.dietDaysByClient,
                [clientId]: mealDays,
            },
        })),
}));
