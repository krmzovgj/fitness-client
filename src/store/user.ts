import { create } from "zustand";
import type { UserRole } from "../model/user";

type User = {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    weight: number;
    height: number;
    age: number;
    gender: string;
    role: UserRole;
};

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
