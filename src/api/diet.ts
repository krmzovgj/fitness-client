import type { Day } from "@/model/day";
import { api } from "./axios";

interface CreateDietDto {
    name: string;
    day: Day;
    clientId: number;
}

export const getDietByClient = async (clientId: number, token: string) => {
    const response = await api.get(`/diet/${clientId}`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    return response;
};

export const createDiet = async (token: string, dto: CreateDietDto) => {
    const response = await api.post("/diet", dto, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    return response;
};

export const updateDiet = async (
    token: string,
    dietId: string,
    dto: CreateDietDto
) => {
    const response = await api.put(`/diet/${dietId}`, dto, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    return response;
};
