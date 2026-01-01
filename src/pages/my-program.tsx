import { DietView } from "@/components/screens/client-details/diet.view";
import { WorkoutView } from "@/components/screens/client-details/workout.view";
import { useUserStore } from "@/store/user";

export const MyProgram = () => {
    const { user } = useUserStore();

    return (
        <div>
            <WorkoutView client={user!} />
            <DietView client={user!} />
        </div>
    );
};
