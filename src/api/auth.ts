import { api } from "./axios";

interface SignInPayload {
    email: string;
    password: string;
}


export const signIn = async (data: SignInPayload): Promise<any> => {
    const response = await api.post<any>("/auth/sign-in", data);
    return response.data;
};
