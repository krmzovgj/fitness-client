import type { Exercise } from "./exercise";

export interface WorkoutExercise {
    id: string
    sets: number;
    reps: string;
    note?: string;
    exercise: Exercise;
    workoutId: string;
    exerciseId: string;
    updatedAt: string;
}
