import type { MealType } from "@/model/meal-type";
import { api } from "./axios";

export interface CreateMealDto {
    name: string;
    description: string;
    cal?: number;
    protein?: number;
    type: MealType;
    dietId: string;
}

export const getMeals = async (token: string, dietId: string) => {
    const response = await api.get(`/diet/${dietId}/meal`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    return response;
};

export const createMeal = async (dto: CreateMealDto, token: string) => {
    const response = await api.post("/meal", dto, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    return response;
};
