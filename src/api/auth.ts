import { api } from "./axios";

interface SignInPayload {
    email: string;
    password: string;
    tenantId: string;
}

export const signIn = async (data: SignInPayload): Promise<any> => {
    const response = await api.post<any>("/auth/sign-in", data, {
        headers: {
            tenantId: data.tenantId,
        },
    });
    return response.data;
};
