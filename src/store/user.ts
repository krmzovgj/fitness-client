import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { User } from "../model/user";

type UserStore = {
    user: User | null;
    isAuthenticated: boolean;
    setUser: (user: User) => void;
    clearUser: () => void;
};

export const useUserStore = create<UserStore>()(
    persist(
        (set) => ({
            user: null,
            isAuthenticated: false,

            setUser: (user: User) => {
                set(() => ({
                    user,
                    isAuthenticated: true,
                }));
            },

            clearUser: () => {
                set(() => ({
                    user: null,
                    isAuthenticated: false,
                }));
            },
        }),
        {
            name: "user-storage",
        }
    )
);
