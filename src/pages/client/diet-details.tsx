import { DietDetailsView } from "@/components/screens/diet-details/diet-details.view";
import { dayColors } from "@/lib/utils";
import { useLocation, useParams } from "react-router-dom";

export const Meals = () => {
    const { id } = useParams();
    const { state } = useLocation();

    const dayMatch = dayColors.find((day) => day.day === state.diet.day);

    return (
        <div className="h-full md:h-screen flex flex-col">
            <DietDetailsView dietId={id!} dayMatch={dayMatch!} state={state} />
        </div>
    );
};
