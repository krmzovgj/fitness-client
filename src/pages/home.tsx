import { getMe } from "@/api/user";
import { ClientsView } from "@/components/screens/home/clients.view";
import { TodaysActivityView } from "@/components/screens/home/todays-activity.view";
import { Spinner } from "@/components/ui/spinner";
import { formatDate } from "@/lib/utils";
import { useAuthStore } from "@/store/auth";
import { useTenantStore } from "@/store/tenant";
import { Calendar } from "iconsax-reactjs";
import { useEffect, useState } from "react";
import { UserRole } from "../model/user";
import { useUserStore } from "../store/user";
import { useNavigate } from "react-router-dom";

export const Home = () => {
    const { user, setUser, clearUser } = useUserStore();
    const { token, clearToken } = useAuthStore();
    const [isLoadingUser, setIsLoadingUser] = useState(false);
    const { tenant } = useTenantStore();
    const navigate = useNavigate();

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
                if (res.status === 200) {
                    setUser(res.data);
                } else {
                    clearToken();
                    clearUser();
                    navigate("/auth/sign-in");
                }
            } catch (err) {
                clearToken();
                clearUser();
                navigate("/auth/sign-in");
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

    const now = new Date();

    return (
        <div className="h-full  flex flex-col  md:h-screen ">
            <div className="mt-10 flex md:flex-row flex-col items-start md:justify-between md:items-end gap-x-20">
                <div className="flex md:mb-0 items-center justify-between w-full md:w-auto">
                    <div>
                        <h3 className="flex md:hidden w-fit py-2.5 px-3.5 rounded-2xl border items-center gap-x-1 text-sm md:text-md text-foreground">
                            <Calendar variant="Bulk" size={20} color="#000" />
                            {formatDate(now)}
                        </h3>

                        <h1 className="text-4xl font-bold mt-3">
                            Hello {user ? user.firstName : "User"},
                        </h1>
                        {user?.role === UserRole.TRAINER ? (
                            <h3 className="text-md font-medium text-muted-foreground flex items-center gap-x-1 mt-1 ml-0.5">
                                Track your clients and their plans
                            </h3>
                        ) : (
                            <h3 className="text-md font-medium text-muted-foreground flex items-center gap-x-1 mt-1 ml-0.5">
                                Track your daily workout and diet plan
                            </h3>
                        )}
                    </div>
                </div>
            </div>

            <div className="flex-1 z-50 flex flex-col">
                {user?.role === UserRole.TRAINER ? (
                    <ClientsView />
                ) : (
                    <div>
                        <TodaysActivityView />
                        {/* <WorkoutView client={user!} /> */}
                        {/* <DietView client={user!} /> */}
                    </div>
                )}
            </div>
        </div>
    );
};
