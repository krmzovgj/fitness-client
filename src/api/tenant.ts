import { api } from "./axios";

export const getTenantBySubdomain = async (
    subdomain: string
) => {
    const response = await api.get(`/tenant/${subdomain}`, {
    });

    return response;
};
