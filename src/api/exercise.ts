import type { Day, Exercise } from "@/model/exercise";
import { api } from "./axios";

export interface CreateExerciseDto {
    name: string;
    sets: number;
    reps: number;
    day: Day;
    workoutId: string;
}

export interface UpdateExerciseDto {
    name: string;
    sets: number;
    reps: number;
    day: Day;
}

export const getExercisesByWorkout = async (
    token: string,
    workoutId: string
) => {
    const response = await api.get<Exercise[]>(
        `/workout/${workoutId}/exercise`,
        {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }
    );

    return response;
};

export const createExercise = async (dto: CreateExerciseDto, token: string) => {
    const response = await api.post<CreateExerciseDto>("/exercise", dto, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    return response;
};

export const updateExercise = async (
    exerciseId: string,
    dto: UpdateExerciseDto,
    token: string
) => {
    const response = await api.put<UpdateExerciseDto>(
        `/exercise/${exerciseId}`,
        dto,
        {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }
    );

    return response;
};

export const deleteExercise = async (exerciseId: string, token: string) => {
    const response = await api.delete(`/exercise/${exerciseId}`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    return response;
};
