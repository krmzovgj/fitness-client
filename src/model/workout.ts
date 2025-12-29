import type { Day } from "./day";
import type { WorkoutExercise } from "./workout-exercise";

export interface Workout {
    id: string;
    name: string;
    day: Day;
    workoutExercises: WorkoutExercise[];
    restDay: boolean;
    clientId: number;
    updatedAt: string;
}
