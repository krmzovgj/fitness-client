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
import { useAuthStore } from "@/store/auth";
import { useTenantStore } from "@/store/tenant";
import { useUserStore } from "@/store/user";
import {
    Direct,
    Home2,
    Lifebuoy,
    LogoutCurve,
    Profile
} from "iconsax-reactjs";
import { Link, useLocation } from "react-router-dom";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "../ui/alert-dialog";

type MenuItem = {
    title: string;
    url: string;
    icon: any;
    external?: boolean;
    commingSoon?: boolean;
};

const MENU_BY_ROLE: Record<UserRole, MenuItem[]> = {
    TRAINER: [
        {
            title: "Clients",
            url: "/",
            icon: Home2,
            commingSoon: false,
        },
        {
            title: "Inbox",
            url: "/inbox",
            icon: Direct,
            commingSoon: true,
        },
        {
            title: "Profile",
            url: "/profile",
            icon: Profile,
            commingSoon: false,
        },
    ],

    CLIENT: [
        {
            title: "Dashboard",
            url: "/",
            icon: Home2,
        },
        {
            title: "Inbox",
            url: "/inbox",
            icon: Direct,
            commingSoon: true,
        },
        {
            title: "Profile",
            url: "/profile",
            icon: Profile,
            commingSoon: false,
        },
    ],
};

export function AppSidebar() {
    const location = useLocation();
    const currentPathName = location.pathname;
    const year = new Date().getFullYear();
    const { tenant } = useTenantStore();
    const { clearToken } = useAuthStore();
    const { clearUser } = useUserStore();
    const { user } = useUserStore();

    const menuItems = MENU_BY_ROLE[user?.role!] || [];

    const signOut = () => {
        clearToken();
        clearUser();
    };

    return (
        <Sidebar className="w-70 flex bg-background border-r-2 border-foreground/5">
            <SidebarContent className="py-2 px-2 md:py-6 md:px-3 flex bg-background flex-col flex-1 w-full ">
                <SidebarHeader>
                    <div className="flex items-center gap-x-2.5">
                        <div className="flex justify-center items-center w-10 h-10 squircle-round bg-foreground">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="24"
                                height="24"
                                viewBox="0 0 24 24"
                                fill="#ffffff"
                                className="-rotate-45"
                            >
                                <g clipPath="url(#clip0_3261_13010)">
                                    <path
                                        opacity="0.4"
                                        d="M6.35999 4.57996C4.64999 4.57996 2.60999 5.22996 2.60999 8.32996V14.33C2.60999 17.43 4.64999 18.08 6.35999 18.08C8.06999 18.08 10.11 17.43 10.11 14.33V8.32996C10.11 5.22996 8.06999 4.57996 6.35999 4.57996Z"
                                        fill="white"
                                        className="fill: var(--fillg);"
                                    />
                                    <path
                                        d="M12.97 10.58H10.11V12.08H12.97V10.58Z"
                                        fill="white"
                                        className="fill: var(--fillg);"
                                    />
                                    <path
                                        d="M22.04 11.42C21.63 11.42 21.29 11.08 21.29 10.67V8.82996C21.29 8.41996 21.63 8.07996 22.04 8.07996C22.45 8.07996 22.79 8.41996 22.79 8.82996V10.67C22.79 11.08 22.45 11.42 22.04 11.42Z"
                                        fill="white"
                                        className="fill: var(--fillg);"
                                    />
                                    <path
                                        d="M1.03998 14.58C0.629978 14.58 0.289978 14.24 0.289978 13.83V8.82996C0.289978 8.41996 0.629978 8.07996 1.03998 8.07996C1.44998 8.07996 1.78998 8.41996 1.78998 8.82996V13.83C1.78998 14.24 1.44998 14.58 1.03998 14.58Z"
                                        fill="white"
                                        className="fill: var(--fillg);"
                                    />
                                    <path
                                        opacity="0.4"
                                        d="M16.67 17.19C16.1 17.03 15.71 16.53 15.71 15.92C15.71 15.31 16.09 14.81 16.69 14.64L17.65 14.39C18.16 14.24 18.53 13.87 18.67 13.37L18.93 12.42L18.99 12.25C19.18 11.75 19.63 11.44 20.18 11.44C20.28 11.44 20.37 11.46 20.47 11.48V8.32996C20.47 5.22996 18.43 4.57996 16.72 4.57996C15.01 4.57996 12.97 5.22996 12.97 8.32996V14.33C12.97 17.43 15.01 18.08 16.72 18.08C17.24 18.08 17.79 18.02 18.31 17.85C18.13 17.67 17.91 17.54 17.66 17.46L16.67 17.19Z"
                                        fill="white"
                                        className="fill: var(--fillg);"
                                    />
                                    <path
                                        d="M23.71 15.9399C23.71 16.0099 23.67 16.1699 23.48 16.2299L22.5 16.4999C21.65 16.7299 21.01 17.3699 20.78 18.2199L20.52 19.1799C20.46 19.3999 20.29 19.4199 20.21 19.4199C20.13 19.4199 19.96 19.3999 19.9 19.1799L19.64 18.2099C19.41 17.3699 18.76 16.7299 17.92 16.4999L16.95 16.2399C16.74 16.1799 16.72 15.9999 16.72 15.9299C16.72 15.8499 16.74 15.6699 16.95 15.6099L17.93 15.3499C18.77 15.1099 19.41 14.4699 19.64 13.6299L19.92 12.6099C19.99 12.4399 20.15 12.4099 20.21 12.4099C20.27 12.4099 20.44 12.4299 20.5 12.5899L20.78 13.6199C21.01 14.4599 21.66 15.0999 22.5 15.3399L23.5 15.6199C23.7 15.6999 23.71 15.8799 23.71 15.9399Z"
                                        fill="white"
                                        className="fill: var(--fillg);"
                                    />
                                </g>
                                <defs>
                                    <clipPath id="clip0_3261_13010">
                                        <rect
                                            width="24"
                                            height="24"
                                            fill="white"
                                        />
                                    </clipPath>
                                </defs>
                            </svg>
                        </div>
                        <div>
                            <h3 className="leading-4 text-md font-bold text-foreground">
                                {tenant?.subdomain}
                            </h3>
                            <h4 className="leading-4 text-sm font-semibold text-muted-foreground">
                                mycoach.mk
                            </h4>
                        </div>
                    </div>
                </SidebarHeader>

                <SidebarGroup className="flex-1 w-full">
                    <SidebarGroupLabel className="font-medium md:font-semibold text-sm">
                        Main
                    </SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {menuItems.map((item) => (
                                <SidebarMenuItem
                                    key={item.title}
                                    className={cn(
                                        "px-3.5 py-2.5 relative rounded-2xl transition-colors",
                                        item.url === currentPathName &&
                                            "bg-secondary"
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
                                            className="gap-x-2.5 relative flex items-center"
                                        >
                                            {item.commingSoon && (
                                                <div className="px-2 h-5 z-20  right-0 absolute text-xs font-medium rounded-lg flex justify-center items-center bg-foreground text-background">
                                                    Comming Soon
                                                </div>
                                            )}

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
                <SidebarGroupLabel className="font-medium md:font-semibold text-sm">
                    Other
                </SidebarGroupLabel>

                <AlertDialog>
                    <div className="flex flex-col gap-y-4">
                        <a
                            href="https://www.instagram.com/mycoach.mk/"
                            target="_blank"
                            className="px-3.5 text-[15px] -mt-2 bg-secondary py-2.5 gap-x-2.5 flex items-center rounded-2xl transition-colors"
                        >
                            <Lifebuoy variant="Bulk" size={20} color="#000" />
                            Help Center
                        </a>

                        <AlertDialogTrigger>
                            <div className="cursor-pointer px-3.5 text-[15px] -mt-2 bg-secondary py-2.5 gap-x-2.5 flex items-center rounded-2xl transition-colors">
                                <LogoutCurve
                                    variant="Bulk"
                                    size={20}
                                    color="red"
                                />{" "}
                                Sign Out
                            </div>
                        </AlertDialogTrigger>
                    </div>

                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>Sign Out?</AlertDialogTitle>
                            <AlertDialogDescription>
                                Are you sure you want to sign out?
                            </AlertDialogDescription>
                        </AlertDialogHeader>

                        <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                                className="w-full md:w-fit"
                                onClick={signOut}
                            >
                                Yes, Sign Out
                            </AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>

                <h3 className="mt-5 text-sm text-muted-foreground text-center">
                    mycoach {year} v1.0.1
                </h3>
            </SidebarFooter>
        </Sidebar>
    );
}
