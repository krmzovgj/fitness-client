import { api } from "./axios";

export const createWorkout = async (token: string, clientId: number) => {
    const response = await api.post(
        "/workout",
        { clientId },
        {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }
    );

    return response;
};

export const getWorkout = async (token: string, clientId: number) => {
    const response = await api.get(`/workout/${clientId}`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    return response;
};
