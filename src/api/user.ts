import type { User } from "../model/user";
import { api } from "./axios";

export const getMe = async (token: string) => {
    const response = await api.get<User>("/user/me", {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    return response.data;
};

export const getUserById = async (id: string, token: string) => {
    const response = await api.get<User>(`/user/${id}`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    return response;
};
