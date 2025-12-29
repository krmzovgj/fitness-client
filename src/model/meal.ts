import type { MealType } from "./meal-type";

export interface Meal {
    id: string;
    name: string;
    description: string;
    cal?: number;
    protein?: number;
    carbs?: number;
    fats?: number;
    type: MealType;
    dietId: string;
    createdAt: string;
    updatedAt: string;
}
