import type { Diet } from "@/model/diet";
import { create } from "zustand";

type DietStore = {
    mealDays: Diet[],
    setMealDays: (mealDays: Diet[]) => void
}

export const useDietStore = create<DietStore>((set) => ({
    mealDays: [],
    setMealDays: (mealDays) => {
        set(() => ({
            mealDays
        }))
    }
}))