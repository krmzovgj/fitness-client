import { DietDetailsView } from "@/components/screens/diet-details/diet-details.view";
import { useLocation, useParams } from "react-router-dom";

export const Meals = () => {
    const { id } = useParams();
    const { state } = useLocation();

    return (
        <div className="h-full flex flex-col">
            <DietDetailsView dietId={id!} clientName={state?.clientName} />
        </div>
    );
};
