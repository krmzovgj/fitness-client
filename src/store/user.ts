import { create } from "zustand";
import type { User } from "../model/user";

type UserStore = {
    user: User | null;
    isAuthenticated: boolean;
    loading: boolean;
    setUser: (user: User) => void;
    clearUser: () => void;
    setLoading: (loading: boolean) => void;
};

export const useUserStore = create<UserStore>((set) => ({
    user: null,
    isAuthenticated: false,
    loading: true,

    setUser: (user) => {
        set(() => ({
            user,
            isAuthenticated: true,
            loading: false,
        }));
    },

    clearUser: () => {
        set(() => ({
            user: null,
            isAuthenticated: false,
            loading: false,
        }));
    },

    setLoading: (loading) => {
        set(() => ({
            loading,
        }));
    },
}));
