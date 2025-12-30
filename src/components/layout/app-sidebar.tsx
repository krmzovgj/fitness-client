import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuItem,
} from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import type { UserRole } from "@/model/user";
import { useTenantStore } from "@/store/tenant";
import { useUserStore } from "@/store/user";
import { Home2, Lifebuoy, Profile } from "iconsax-reactjs";
import { Link, useLocation } from "react-router-dom";

type MenuItem = {
    title: string;
    url: string;
    icon: any;
    external?: boolean;
};

const MENU_BY_ROLE: Record<UserRole, MenuItem[]> = {
    TRAINER: [
        {
            title: "Clients",
            url: "/",
            icon: Home2,
        },
        {
            title: "Profile",
            url: "/profile",
            icon: Profile,
        },
    ],

    CLIENT: [
        {
            title: "Dashboard",
            url: "/",
            icon: Home2,
        },
        {
            title: "Profile",
            url: "/profile",
            icon: Profile,
        },
    ],
};

export function AppSidebar() {
    const location = useLocation();
    const currentPathName = location.pathname;
    const year = new Date().getFullYear();
    const { tenant } = useTenantStore();

    const { user } = useUserStore();
    const menuItems = MENU_BY_ROLE[user?.role!] || [];

    return (
        <Sidebar className="w-70 flex bg-background border-r-2 border-foreground/5">
            <SidebarContent className="py-2 md:py-6 md:px-3 flex bg-background flex-col flex-1 w-full ">
                <SidebarHeader>
                    <div className="flex items-center gap-x-2.5">
                        <img
                            src="/logo.png"
                            className="w-10 h-10 rounded-xl border"
                            alt=""
                        />
                        <div>
                            <h3 className="leading-4 text-md font-bold text-foreground">
                                {tenant?.subdomain}
                            </h3>
                            <h4 className="leading-4 text-sm font-semibold text-muted-foreground">
                                Basic Plan
                            </h4>
                        </div>
                    </div>
                </SidebarHeader>

                <SidebarGroup className="flex-1 w-full">
                    <SidebarGroupLabel className="font-semibold text-sm">
                        Menu
                    </SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {menuItems.map((item) => (
                                <SidebarMenuItem
                                    key={item.title}
                                    className={cn(
                                        "px-3.5 py-2.5 bg-secondary rounded-2xl transition-colors"
                                    )}
                                >
                                    {item.external ? (
                                        <a
                                            href={item.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="gap-x-2.5 flex items-center"
                                        >
                                            <item.icon
                                                variant="Bulk"
                                                size={20}
                                                color="#181818"
                                            />
                                            <span className="text-[15px]">
                                                {item.title}
                                            </span>
                                        </a>
                                    ) : (
                                        <Link
                                            to={item.url}
                                            className="gap-x-2.5 flex items-center"
                                        >
                                            <item.icon
                                                variant={
                                                    item.url === currentPathName
                                                        ? "Bold"
                                                        : "Bulk"
                                                }
                                                size={20}
                                                color="#181818"
                                            />
                                            <span className="text-[15px]">
                                                {item.title}
                                            </span>
                                        </Link>
                                    )}
                                </SidebarMenuItem>
                            ))}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>

            <SidebarFooter className="py-6 md:px-3">
                <SidebarGroupLabel className="font-semibold text-sm">
                    Other
                </SidebarGroupLabel>
                <a
                    href="https://www.instagram.com/mycoach.mk/"
                    target="_blank"
                    className="px-3.5 -mt-2 bg-secondary py-2.5 gap-x-2.5 flex items-center rounded-2xl transition-colors"
                >
                    <Lifebuoy variant="Bulk" size={20} color="#000" />
                    Help Center
                </a>

                <h3 className="mt-5 text-sm text-muted-foreground text-center">
                    mycoach {year} v1.0.1
                </h3>
            </SidebarFooter>
        </Sidebar>
    );
}
