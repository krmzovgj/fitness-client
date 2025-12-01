import type { MealType } from "./meal-type";

export interface Meal {
    id: string;
    name: string;
    desctription: string;
    cal?: number;
    protein?: number;
    type: MealType;
    dietId: string;
    createdAt: string;
    updatedAt: string;
}
