import { DietView } from "@/components/screens/client-details/diet.view";
import { WorkoutView } from "@/components/screens/client-details/workout.view";
import { useUserStore } from "@/store/user";

export const MyProgram = () => {
    const { user } = useUserStore();

    return (
        <div className="mt-10">
            <h1 className="text-3xl">{user?.firstName}'s Program</h1>

            <WorkoutView client={user!} />
            <DietView client={user!} />
        </div>
    );
};
