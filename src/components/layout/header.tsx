import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { formatDate } from "@/lib/utils";
import type { User } from "@/model/user";
import { useAuthStore } from "@/store/auth";
import { useTenantStore } from "@/store/tenant";
import { useUserStore } from "@/store/user";
import {
    ArrowDown2,
    Lifebuoy,
    LogoutCurve,
    Profile
} from "iconsax-reactjs";
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
import { Avatar } from "../ui/avatar";
import { SidebarTrigger } from "../ui/sidebar";

export const Header = ({ user }: { user?: User }) => {
    const { clearToken } = useAuthStore();
    const { clearUser } = useUserStore();
    const { tenant } = useTenantStore();

    const signOut = () => {
        clearToken();
        clearUser();
    };

    const now = new Date();

    return (
        <div className="pt-5 md:py-5 md:px-10 px-5 flex justify-between items-center">

            <img src="/favicon.png" className="flex md:hidden w-9 h-9" alt="" />
            <div className="flex md:hidden items-center gap-x-2 text-xl font-bold">
                {tenant?.subdomain}
            </div>
            <div className="flex items-center gap-x-3">
                {user && (
                    <div className="w-10 md:hidden flex">
                        <SidebarTrigger />
                    </div>
                )}

                <div className="hidden md:flex  items-end md:text-2xl md:font-bold">
                    {tenant?.subdomain}
                </div>
            </div>

            <h3 className="hidden md:flex items-center text-sm md:text-md text-foreground">
                {formatDate(now)}
            </h3>

            <AlertDialog>
                <div className="hidden md:flex items-center gap-x-5">
                    {user && (
                        <div className="flex items-center gap-x-3">
                            <DropdownMenu>
                                <DropdownMenuTrigger>
                                    <div className="relative cursor-pointer">
                                        <Avatar
                                            firstName={user.firstName}
                                            lastName={user.lastName}
                                        />
                                        <div className="bg-white absolute -bottom-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center">
                                            <ArrowDown2
                                                variant="Bold"
                                                size={14}
                                                color="#000"
                                            />
                                        </div>
                                    </div>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent>
                                    <DropdownMenuLabel>
                                        My Account
                                    </DropdownMenuLabel>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem>
                                        <Profile
                                            variant="Bulk"
                                            size={15}
                                            color="#000"
                                        />
                                        Profile
                                    </DropdownMenuItem>

                                    <a
                                        href="https://www.instagram.com/mycoach.mk/"
                                        target="_blank"
                                    >
                                        <DropdownMenuItem>
                                            <Lifebuoy
                                                variant="Bulk"
                                                size={15}
                                                color="#000"
                                            />
                                            Need Help?
                                        </DropdownMenuItem>
                                    </a>
                                    <AlertDialogTrigger asChild>
                                        <DropdownMenuItem>
                                            <LogoutCurve
                                                variant="Bulk"
                                                size={15}
                                                color="red"
                                            />
                                            Sign Out
                                        </DropdownMenuItem>
                                    </AlertDialogTrigger>
                                </DropdownMenuContent>
                            </DropdownMenu>

                            <AlertDialogContent>
                                <AlertDialogHeader>
                                    <AlertDialogTitle>
                                        Sign Out?
                                    </AlertDialogTitle>
                                    <AlertDialogDescription>
                                        Are you sure you want to sign out?
                                    </AlertDialogDescription>
                                </AlertDialogHeader>

                                <AlertDialogFooter>
                                    <AlertDialogCancel>
                                        Cancel
                                    </AlertDialogCancel>
                                    <AlertDialogAction className="w-fit" onClick={signOut}>
                                        Yes, Sign Out
                                    </AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </div>
                    )}
                </div>
            </AlertDialog>
        </div>
    );
};
