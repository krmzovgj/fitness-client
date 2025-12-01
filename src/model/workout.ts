import type { Day } from "./day";
import type { Exercise } from "./exercise";

export interface Workout {
    id: string;
    name: string;
    day: Day;
    exercises: Exercise[];
    clientId: number;
}
