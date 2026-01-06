import type { WorkoutExercise } from "@/model/workout-exercise";
import { api } from "./axios";

export interface CreateWorkoutExerciseDto {
    sets: number;
    reps: string;
    weight?: number;
    note?: string;
    restBetweenSets?: string;
    restAfterExercise?: string;
    orderNumber: number;
    exerciseId: string;
}

export interface UpdateWorkoutExerciseDto {
    sets: number;
    reps: string;
    weight?: number;
    note?: string;
    restBetweenSets?: string;
    restAfterExercise?: string;
    exerciseId: string;
}

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

export const reorderWorkoutExercise = async (
    token: string,
    workoutId: string,
    body: { items: { id: string; orderNumber: number }[] }
) => {
    const response = await api.patch(
        `/workout-exercise/${workoutId}/reorder`,
        body,
        {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }
    );
    return response;
};

export const createWorkoutExercise = async (
    dto: CreateWorkoutExerciseDto,
    token: string,
    workoutId: string
) => {
    const response = await api.post<CreateWorkoutExerciseDto>(
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

export const updateWorkoutExercise = async (
    workoutExerciseId: string,
    dto: UpdateWorkoutExerciseDto,
    token: string
) => {
    const response = await api.put<UpdateWorkoutExerciseDto>(
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

export const deleteWorkoutExercise = async (
    exerciseId: string,
    token: string
) => {
    const response = await api.delete(`/workout-exercise/${exerciseId}`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    return response;
};
