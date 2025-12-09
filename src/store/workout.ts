import type { Workout } from "@/model/workout";
import { create } from "zustand";

type WorkoutStore = {
    workouts: Workout[];
    setWorkouts: (workouts: Workout[]) => void;
};

export const useWorkoutStore = create<WorkoutStore>((set) => ({
    workouts: [],
    setWorkouts: (workouts) => {
        set(() => ({
            workouts,
        }));
    },
}));
