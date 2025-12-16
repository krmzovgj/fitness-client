import type { Workout } from "@/model/workout";
import { create } from "zustand";

type WorkoutStore = {
  workoutsByClient: Record<string, Workout[]>;
  setWorkouts: (clientId: number, workouts: Workout[]) => void;
  clearClient: (clientId: number) => void;
};

export const useWorkoutStore = create<WorkoutStore>((set) => ({
  workoutsByClient: {},
  setWorkouts: (clientId, workouts) =>
    set((state) => ({
      workoutsByClient: {
        ...state.workoutsByClient,
        [clientId]: workouts,
      },
    })),
  clearClient: (clientId) =>
    set((state) => {
      const copy = { ...state.workoutsByClient };
      delete copy[clientId];
      return { workoutsByClient: copy };
    }),
}));
