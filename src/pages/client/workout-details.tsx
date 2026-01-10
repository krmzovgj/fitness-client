import { WorkoutDetailsView } from "@/components/screens/workout-details/workout-details.view";
import { useLocation, useParams } from "react-router-dom";

export const WorkoutDetails = () => {
    const { id } = useParams();
    const { state } = useLocation();

    return (
        <div className="h-full flex flex-col ">
            <WorkoutDetailsView
                workoutId={id!}
                clientName={state?.clientName}
            />
        </div>
    );
};
