import type { Exercise } from "./exercise";

export interface WorkoutExercise {
    id: string;
    sets: number;
    reps: string;
    note?: string;
    weight?: number;
    restBetweenSets?: string;
    restAfterExercise?: string;
    exercise: Exercise;
    orderNumber: number;
    workoutId: string;
    exerciseId: string;
    updatedAt: string;
}
