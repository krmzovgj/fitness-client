import type { Day } from "./day";

export interface Exercise {
    id: string;
    name: string;
    sets: number;
    reps: number;
    day: Day;
    workoutId: string;
    createdAt: string; 
    updatedAt: string; 
}
