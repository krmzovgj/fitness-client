// src/layouts/AppLayout.tsx
import { AppSidebar } from "@/components/app-sidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { Outlet } from "react-router-dom";
import { Header } from "../header";
import { useUserStore } from "@/store/user";

export function AppLayout() {
    const { user } = useUserStore();

    return (
        <SidebarProvider>
            <div className="flex min-h-screen tracking-tight w-full overflow-hidden">
                <AppSidebar />

                <main className=" flex-1 min-w-0 md:ml-70 md:py-8 md:px-10 py-5 px-5">
                    <Header user={user!} />
                    <Outlet />
                </main>
            </div>
        </SidebarProvider>
    );
}
