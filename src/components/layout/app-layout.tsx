// src/layouts/AppLayout.tsx
import { AppSidebar } from "@/components/layout/app-sidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { Outlet } from "react-router-dom";
import { useUserStore } from "@/store/user";
import { Header } from "./header";
import { GridPattern } from "../ui/shadcn-io/grid-pattern";
import { cn } from "@/lib/utils";

export function AppLayout() {
    const { user } = useUserStore();

    return (
        <SidebarProvider>
            <div className="flex min-h-screen tracking-tight w-full overflow-hidden">
                <AppSidebar />

                <main className="flex-1 relative min-w-0 md:ml-70">
                    {user && <Header user={user!} />}

                    <GridPattern
                        width={30}
                        height={30}
                        strokeDasharray="2 6"
                        className={cn(
                            "fixed inset-0 z-0 pointer-events-none",
                            "mask-[radial-gradient(1500px_circle_at_center,white,transparent)]"
                        )}
                    />

                    <div className="md:px-10 relative md:pb-8 pb-5 px-5">
                        <Outlet />
                    </div>
                </main>
            </div>
        </SidebarProvider>
    );
}
