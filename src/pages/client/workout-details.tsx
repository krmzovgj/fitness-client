import { WorkoutDetailsView } from "@/components/screens/workout-details/workout-details.view";
import { dayColors } from "@/lib/utils";
import { useLocation, useParams } from "react-router-dom";

export const Exercises = () => {
    const { id } = useParams();
    const { state } = useLocation();

    const dayMatch = dayColors.find((day) => day.day === state.workout.day);

    return (
        <div className="h-full md:h-screen flex flex-col ">
            <WorkoutDetailsView
                workoutId={id!}
                dayMatch={dayMatch!}
                state={state}
            />
        </div>
    );
};
