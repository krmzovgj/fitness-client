import { create } from "zustand";
import type { User, UserRole } from "../model/user";

type UserStore = {
    user: User | null;
    setUser: (user: User) => void;
    clearUser: () => void;
};

export const useUserStore = create<UserStore>((set) => ({
    user: null,
    setUser: (user) =>
        set(() => ({
            user,
            isAutnenticated: true,
        })),
    clearUser: () => {
        set(() => ({
            user: null,
            isAutneticated: false,
        }));
    },
}));
