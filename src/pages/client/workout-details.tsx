import { ExerciseSection } from "@/components/exercise-section";
import { dayColors } from "@/lib/utils";
import { useLocation, useParams } from "react-router-dom";

export const Exercises = () => {
    const { id } = useParams();
    const { state } = useLocation();

    const dayMatch = dayColors.find((day) => day.day === state.day);

    return (
        <div className="h-full md:h-screen flex flex-col ">
            <ExerciseSection
                workoutId={id!}
                dayMatch={dayMatch!}
                state={state}
            />
        </div>
    );
};
