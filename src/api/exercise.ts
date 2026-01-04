import type { Exercise } from "@/model/exercise";
import { api } from "./axios";

export const createGlobalExercise = async (
    tenantId: string,
    token: string,
    name: string
) => {
    const response = await api.post(
        "/exercise",
        { name, tenantId },
        {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }
    );

    return response;
};

export const searchExercises = async (
    tenantId: string,
    token: string,
    search?: string
) => {
    const response = await api.get<Exercise[]>(`/exercise?search=${search}`, {
        headers: {
            tenantId: tenantId,
            Authorization: `Bearer ${token}`,
        },
    });

    return response;
};
