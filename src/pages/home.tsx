import { Flash } from "iconsax-reactjs";
import { Header } from "../components/header";
import { UserRole } from "../model/user";
import { useUserStore } from "../store/user";
import { ClientsSection } from "@/components/clients-section";
import { WorkoutSection } from "@/components/workout-section";
import { DietSection } from "@/components/diet-section";
import { UserStats } from "@/components/user-stats";
import { Spinner } from "@/components/ui/spinner";

export const Home = () => {
    const { user, loading } = useUserStore();

    if (!user && !loading) {
        return (
            <div className="flex items-center justify-center h-screen">
                Internal Error. Try again later
            </div>
        );
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center w-screen h-screen">
                <Spinner className="size-10" />
            </div>
        );
    }

    return (
        <div className="h-full overflow-y-scroll md:h-screen w-screen md:p-10 p-8">
            <Header user={user!} />

            <div className="mt-20 flex md:flex-row flex-col items-start md:items-end gap-x-20">
                <div className="flex mb-5 md:mb-0 items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold">
                            Hello {user?.firstName},
                        </h1>
                        {user?.role === UserRole.TRAINER ? (
                            <h3 className="text-sm md:text-md font-medium text-foreground/80 flex items-center gap-x-1 mt-1 -ml-0.5">
                                <Flash variant="Bold" size={18} color="#000" />{" "}
                                Track your clients and their plans
                            </h3>
                        ) : (
                            <h3 className="text-sm md:text-md font-medium text-foreground/80 flex items-center gap-x-1 mt-1 -ml-0.5">
                                <Flash variant="Bold" size={18} color="#000" />{" "}
                                Track your daily workout and diet plan
                            </h3>
                        )}
                    </div>
                </div>

                {user?.role === UserRole.CLIENT && <UserStats client={user} />}
            </div>

            {user?.role === UserRole.TRAINER && <ClientsSection />}

            {user?.role === UserRole.CLIENT && (
                <div>
                    <WorkoutSection client={user} />
                    <DietSection client={user} />
                </div>
            )}
        </div>
    );
};
