import type { User, UserRole } from "@/model/user";
import { api } from "./axios";

interface CreateClientDto {
    firstName: string;
    lastName: string;
    email: string;
    age: number | any;
    height: number | any;
    weight: number | any;
    gender: string;
    role: UserRole;
    password: string;
}

export const addClient = async (token: string, data: CreateClientDto) => {
    const response = await api.post("/user/client", data, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    return response;
};

export const getClients = async (token: string) => {
    const response = await api.get<User[]>("/user/client", {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    return response;
};
