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
                    <Header user={user!} />
                    <GridPattern
                        width={30}
                        height={30}
                        x={-1}
                        y={-1}
                        strokeDasharray={"4 2"}
                        className={cn(
                            "absolute h-full w-full z-0 opacity-70 mask-[radial-gradient(1000px_circle_at_center,white,transparent)]"
                        )}
                    />
                    <div className="md:px-10 md:pb-8 pb-5 px-5">
                        <Outlet />
                    </div>
                </main>
            </div>
        </SidebarProvider>
    );
}
