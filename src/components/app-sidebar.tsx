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
import { useTenantStore } from "@/store/tenant";
import { Hashtag, Home2, Profile } from "iconsax-reactjs";
import { Link, useLocation } from "react-router-dom";

// Menu items.
const items = [
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
];

export function AppSidebar() {
    const location = useLocation();
    const currentPathName = location.pathname;
    const year = new Date().getFullYear();
    const { tenant } = useTenantStore();

    return (
        <Sidebar className="py-6 md:px-4 w-70 flex bg-background border-r">
            <SidebarContent className="flex bg-background flex-col flex-1 w-full ">
                <SidebarHeader>
                    <div className="flex items-center gap-x-1">
                        <Hashtag variant="Bold" size={40} color="#66A786" />
                        <div>
                            <h3 className="leading-4 uppercase text-sm font-black text-foreground">
                                {tenant?.subdomain}
                            </h3>
                            <h4 className="leading-4 text-sm font-semibold">
                                mycoach.mk
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
                            {items.map((item) => (
                                <SidebarMenuItem
                                    className={cn(
                                        "px-3.5 py-2.5 rounded-2xl transition-colors hover:bg-muted/50",
                                        item.url === currentPathName &&
                                            "bg-muted/50"
                                    )}
                                    key={item.title}
                                >
                                    <Link
                                        to={item.url}
                                        className="gap-x-2.5 flex items-center"
                                    >
                                        <item.icon
                                            variant="Bold"
                                            size={20}
                                            color={
                                                item.url === currentPathName
                                                    ? "#000"
                                                    : "#999B9D"
                                            }
                                        />
                                        <span
                                            style={{
                                                color:
                                                    item.url === currentPathName
                                                        ? "#181818"
                                                        : "#999B9D",
                                            }}
                                            className="leading-0  text-[15px]"
                                        >
                                            {item.title}
                                        </span>
                                    </Link>
                                </SidebarMenuItem>
                            ))}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>

            <SidebarFooter>
                <h3 className="text-sm text-foreground/80 text-left">
                    {year}, mycoach v1.0.1
                </h3>
            </SidebarFooter>
        </Sidebar>
    );
}
