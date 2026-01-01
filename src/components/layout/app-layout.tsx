// src/layouts/AppLayout.tsx
import { AppSidebar } from "@/components/layout/app-sidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { Outlet } from "react-router-dom";
import { useUserStore } from "@/store/user";
import { Header } from "./header";

export function AppLayout() {
    const { user } = useUserStore();

    return (
        <SidebarProvider>
            <div className="flex min-h-screen tracking-tight w-full overflow-hidden">
                <AppSidebar />

                <main className="flex-1 min-w-0 md:ml-70">
                    <Header user={user!} />
                    <div className="md:px-10 md:pb-8 pb-5 px-5">
                        <Outlet />
                    </div>
                </main>
            </div>
        </SidebarProvider>
    );
}
