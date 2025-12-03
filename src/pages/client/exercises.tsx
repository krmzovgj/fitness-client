import { ExerciseSection } from "@/components/exercise-section";
import { Header } from "@/components/header";
import { dayColors } from "@/lib/utils";
import { useUserStore } from "@/store/user";
import { useLocation, useParams } from "react-router-dom";

export const Exercises = () => {
    const { user } = useUserStore();
    const { id } = useParams();
    const { state } = useLocation();

    const dayMatch = dayColors.find((day) => day.day === state.day);

    return (
        <div className="h-full overflow-x-hidden md:h-screen overflow-y-scroll flex flex-col w-screen md:p-10 p-8">
            <Header user={user!} />

            

            <ExerciseSection workoutId={id!} dayMatch={dayMatch!} state={state} />
        </div>
    );
};
