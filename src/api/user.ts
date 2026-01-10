import type { User } from "../model/user";
import { api } from "./axios";

interface UpdateUserDto {
    firstName: string;
    lastName: string;
    email: string;
    weight: number;
    age: number;
    height: number;
    gender: string;
}

export const getMe = async (token: string, tenantId: string) => {
    const response = await api.get<User>("/user/me", {
        headers: {
            Authorization: `Bearer ${token}`,
            tenantId: tenantId,
        },
    });

    return response;
};

export const getUserById = async (id: string, token: string) => {
    const response = await api.get<User>(`/user/${id}`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    return response;
};

export const updateUser = async (
    id: number,
    token: string,
    body: UpdateUserDto
) => {
    const response = api.put(`/user/${id}`, body, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    return response;
};

export const deleteUser = async (userId: number, token: string) => {
    const response = await api.delete(`/user/${userId}`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    return response;
};
