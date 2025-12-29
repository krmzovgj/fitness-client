import type { Workout } from "@/model/workout";
import { api } from "./axios";
import type { Day } from "@/model/day";

interface CreateWorkoutDto {
    name?: string;
    day: Day;
    restDay: boolean;
    clientId: number;
}

interface UpdateWorkoutDto {
    name?: string;
    day: Day;
    note?: string;
    restDay: boolean;
    clientId: number;
}

export const getWorkoutsByClient = async (token: string, clientId: number) => {
    const response = await api.get<Workout[]>(`/workout/${clientId}`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    return response;
};

export const getWorkoutById = async (token: string, workoutId: string) => {
    const response = await api.get<Workout>(`/workout/${workoutId}`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    return response;
};

export const createWorkout = async (token: string, dto: CreateWorkoutDto) => {
    const response = await api.post("/workout", dto, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    return response;
};

export const updateWorkout = async (
    workoutId: string,
    token: string,
    dto: UpdateWorkoutDto
) => {
    const response = await api.put(
        `/workout/${workoutId}`,
        {
            name: dto.name,
            day: dto.day,
            restDay: dto.restDay,
            note: dto.note,
            clientId: dto.clientId,
        },
        {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }
    );

    return response;
};
