import { getMe } from "@/api/user";
import { ClientsSection } from "@/components/clients-section";
import { DietSection } from "@/components/diet-section";
import { Spinner } from "@/components/ui/spinner";
import { UserStats } from "@/components/user-stats";
import { WorkoutSection } from "@/components/workout-section";
import { useAuthStore } from "@/store/auth";
import { useTenantStore } from "@/store/tenant";
import { useEffect, useState } from "react";
import { UserRole } from "../model/user";
import { useUserStore } from "../store/user";

export const Home = () => {
    const { user, setUser, clearUser } = useUserStore();
    const { token, clearToken } = useAuthStore();
    const [isLoadingUser, setIsLoadingUser] = useState(false);
    const { tenant } = useTenantStore();

    useEffect(() => {
        if (user) return;

        const loadUser = async () => {
            if (!token || !tenant) {
                clearUser();
                setIsLoadingUser(false);
                return;
            }

            try {
                setIsLoadingUser(true);
                const res = await getMe(token, tenant?.id);
                setUser(res.data);
            } catch (err) {
                console.warn("Invalid or expired token");
                clearToken();
                clearUser();
            } finally {
                setIsLoadingUser(false);
            }
        };

        loadUser();
    }, [token, setUser, clearToken]);

    if (isLoadingUser) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen gap-4">
                <Spinner className="size-6" />
            </div>
        );
    }

    return (
        <div className="h-full  flex flex-col  md:h-screen ">
            <div className="mt-10 md:mt-20 flex md:flex-row flex-col items-start md:justify-between md:items-end gap-x-20">
                <div className="flex mb-5 md:mb-0 items-center justify-between w-full md:w-auto">
                    <div>
                        <h1 className="text-4xl font-bold">
                            Hello {user ? user.firstName : "User"},
                        </h1>
                        {user?.role === UserRole.TRAINER ? (
                            <h3 className="text-lg font-medium text-foreground/80 flex items-center gap-x-1 mt-0 ml-0.5">
                                {/* <Flash color="#000" variant="Bold" size={15} /> */}
                                Track your clients and their plans
                            </h3>
                        ) : (
                            <h3 className="text-lg font-medium text-foreground/80 flex items-center gap-x-1 mt-0 ml-0.5">
                                {/* <Flash color="#000" variant="Bold" size={15} /> */}
                                Track your daily workout and diet plan
                            </h3>
                        )}
                    </div>
                </div>

                {user?.role === UserRole.CLIENT && (
                    <div className="md:w-fit w-full relative">
                        <UserStats client={user} />
                        <div className="absolute md:hidden flex -right-2 top-0 bottom-0 w-16 bg-linear-to-l from-white to-transparent dark:from-background dark:to-transparent pointer-events-none" />
                    </div>
                )}
            </div>

            <div className="flex-1 z-50 flex flex-col">
                {user?.role === UserRole.TRAINER ? (
                    <ClientsSection />
                ) : (
                    <div>
                        {/* <TodaysActivity /> */}
                        <WorkoutSection client={user!} />
                        <DietSection client={user!} />
                    </div>
                )}
            </div>
        </div>
    );
};
