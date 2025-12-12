import { ClientsSection } from "@/components/clients-section";
import { DietSection } from "@/components/diet-section";
import { UserStats } from "@/components/user-stats";
import { WorkoutSection } from "@/components/workout-section";
import { formatDate } from "@/lib/utils";
import { Flash } from "iconsax-reactjs";
import { Header } from "../components/header";
import { UserRole } from "../model/user";
import { useUserStore } from "../store/user";

export const Home = () => {
    const { user } = useUserStore();

    const now = new Date();

    return (
        <div className="h-full flex flex-col overflow-x-hidden md:h-screen md:p-8 p-6">
            <Header user={user!} />

            <div className="mt-20 flex md:flex-row flex-col items-start md:justify-between md:items-end gap-x-20">
                <div className="flex mb-5 md:mb-0 items-center justify-between">
                    <div>
                        <h3 className="text-sm md:text-md text-foreground">
                            {formatDate(now)}
                        </h3>
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

                {user?.role === UserRole.CLIENT && (
                    <div className="md:w-fit w-full relative">
                        <UserStats client={user!} />

                        <div
                            className="absolute md:hidden flex -right-2 top-0 bottom-0 w-16 
                                bg-linear-to-l from-white to-transparent 
                                dark:from-background-dark dark:to-transparent"
                        />
                    </div>
                )}
            </div>

            <div className="flex-1 flex flex-col">
                {user?.role === UserRole.TRAINER && <ClientsSection />}
            </div>

            {user?.role === UserRole.CLIENT && (
                <div>
                    <WorkoutSection client={user} />
                    <DietSection client={user} />
                </div>
            )}
        </div>
    );
};
