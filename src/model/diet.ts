import type { Day } from "./day";
import type { Meal } from "./meal";

export interface Diet {
    id: string;
    name: string;
    day: Day;
    meals: Meal[];
    clientId: number;
    updatedAt: string;
}
