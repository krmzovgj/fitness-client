import type { User } from "@/model/user";
import { api } from "./axios";

interface CreateClientDto {
    firstName: string;
    lastName: string;
    email: string;
    age?: number;
    height?: number;
    weight?: number;
    workoutPlan?: boolean;
    dietPlan?: boolean;
    gender: string;
    password: string;
}

interface UpdateClientDto {
    firstName: string;
    lastName: string;
    email: string;
    age?: number;
    height?: number;
    weight?: number;
    workoutPlan?: boolean;
    dietPlan?: boolean;
    gender: string;
}

export const addClient = async (token: string, data: CreateClientDto) => {
    const response = await api.post("/user/client", data, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    return response;
};

export const getClients = async (token: string, tenantId: string) => {
    const response = await api.get<User[]>(`/user/client/${tenantId}`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    return response;
};

export const updateClient = async (
    userId: number,
    token: string,
    data: UpdateClientDto
) => {
    const response = await api.put(`/user/${userId}`, data, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    return response;
};
