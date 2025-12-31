import { create } from "zustand";
import { persist } from "zustand/middleware";

type AuthStore = {
    token: string | null;
    setToken: (t: string) => void;
    clearToken: () => void;
};

export const useAuthStore = create(
    persist<AuthStore>(
        (set) => ({
            token: null,
            setToken: (t) => set({ token: t }),
            clearToken: () => set({ token: null }),
        }),
        {
            name: "auth-store",
        }
    )
);
