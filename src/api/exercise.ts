import type { WorkoutExercise } from "@/model/workout-exercise";
import { api } from "./axios";
import type { Exercise } from "@/model/exercise";

export interface CreateExerciseDto {
    sets: number;
    reps: string;
    exerciseId: string;
}

export interface UpdateExerciseDto {
    sets: number;
    reps: string;
    exerciseId: string;
}

export const searchExercises = async (token: string, search?: string) => {
    const response = await api.get<Exercise[]>(`/exercise?search=${search}`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    return response;
};

export const getExercisesByWorkout = async (
    token: string,
    workoutId: string
) => {
    const response = await api.get<WorkoutExercise[]>(
        `/workout/${workoutId}/exercise`,
        {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }
    );

    return response;
};

export const createExercise = async (
    dto: CreateExerciseDto,
    token: string,
    workoutId: string
) => {
    const response = await api.post<CreateExerciseDto>(
        `/workout-exercise/${workoutId}`,
        dto,
        {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }
    );

    return response;
};

export const updateExercise = async (
    workoutExerciseId: string,
    dto: UpdateExerciseDto,
    token: string
) => {
    const response = await api.put<UpdateExerciseDto>(
        `/workout-exercise/${workoutExerciseId}`,
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
    const response = await api.delete(`/workout-exercise/${exerciseId}`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    return response;
};
