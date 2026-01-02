import type { Exercise } from "@/model/exercise";
import { api } from "./axios";



export const createGlobalExercise = async (token: string, name: string) => {
    const response = await api.post(
        "/exercise",
        { name },
        {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }
    );

    return response;
};

export const searchExercises = async (token: string, search?: string) => {
    const response = await api.get<Exercise[]>(`/exercise?search=${search}`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    return response;
};

