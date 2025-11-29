import type { Day } from "@/model/exercise";
import { api } from "./axios";
import type { Type } from "@/model/meal";

export interface CreateMealDto {
    name: string;
    description: string;
    cal?: number;
    protein?: number;
    day: Day;
    type: Type;
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
