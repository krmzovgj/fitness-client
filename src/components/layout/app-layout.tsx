// src/layouts/AppLayout.tsx
import { AppSidebar } from "@/components/app-sidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { Outlet } from "react-router-dom";

export function AppLayout() {
    return (
        <SidebarProvider>
            <div className="flex min-h-screen w-full overflow-hidden">
                <AppSidebar />

                <main className="flex-1 min-w-0 md:ml-70 md:p-8 p-6">
                    <Outlet />
                </main>
            </div>
        </SidebarProvider>
    );
}
