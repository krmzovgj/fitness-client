import type { Tenant } from "@/model/tenant";
import { create } from "zustand";

type TenantStore = {
    tenant: Tenant | null;
    setTenant: (tenant: Tenant) => void;
    clearTenant: () => void;
};

export const useTenantStore = create<TenantStore>((set) => ({
    tenant: null as Tenant | null,
    setTenant: (tenant: Tenant) => set({ tenant }),
    clearTenant: () => set({ tenant: null }),
}));
