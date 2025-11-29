import { api } from "./axios";

export const getDietByClient = async (clientId: number, token: string) => {
    const response = await api.get(`/diet/${clientId}`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    return response;
};
