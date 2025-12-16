import type { User } from "@/model/user";
import { useAuthStore } from "@/store/auth";
import { useUserStore } from "@/store/user";
import { Hashtag, Logout } from "iconsax-reactjs";
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
} from "./ui/alert-dialog";
import { Avatar } from "./ui/avatar";
import { Button } from "./ui/button";
import { useTenantStore } from "@/store/tenant";

export const Header = ({ user }: { user?: User }) => {
    const { clearToken } = useAuthStore();
    const { clearUser } = useUserStore();
    const { tenant } = useTenantStore();

    const signOut = () => {
        clearToken();
        clearUser();
    };

    return (
        <div className="flex justify-between items-center">
            <div className="">
                <h3 className="text-xl leading-4 font-bold text-foreground/70">
                    {tenant?.subdomain}
                </h3>
                <div className="flex items-center gap-x-1 leading-0">
                    <Hashtag variant="Bold" size={20} color="#66A786" />
                    <h3 className="text-xl font-bold text-foreground">
                        my.coach
                    </h3>
                </div>
            </div>

            <div className="flex items-center gap-x-5">
                {user && (
                    <div className="flex items-center gap-x-2">
                        <div className="hidden md:block">
                            <h3 className="text-right font-medium">
                                {user?.firstName} {user?.lastName}
                            </h3>
                            <h3 className="text-right text-sm text-foreground/80 font-medium -mt-0.5">
                                {user?.email}
                            </h3>
                        </div>

                        <Avatar
                            firstName={user.firstName}
                            lastName={user.lastName}
                        />

                        <AlertDialog>
                            <AlertDialogTrigger asChild>
                                <Button
                                    variant="ghost"
                                    className="flex bg-muted/50 items-center gap-x-1"
                                >
                                    <Logout color="red" size={20} />
                                </Button>
                            </AlertDialogTrigger>

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
                                    <AlertDialogAction onClick={signOut}>
                                        Yes, Sign Out
                                    </AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>
                    </div>
                )}
            </div>
        </div>
    );
};
