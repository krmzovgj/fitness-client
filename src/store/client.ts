import type { User } from "@/model/user";
import { create } from "zustand";

type ClientStore = {
    clients: User[] | null;
    setClients: (clients: User[]) => void;
};

export const useClientStore = create<ClientStore>((set) => ({
    clients: null,
    setClients: (clients) => {
        set(() => ({
            clients,
        }));
    },
}));
