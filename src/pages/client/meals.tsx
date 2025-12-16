import { Header } from "@/components/header";
import { MealsSection } from "@/components/meals-section";
import { dayColors } from "@/lib/utils";
import { useUserStore } from "@/store/user";
import { useLocation, useParams } from "react-router-dom";

export const Meals = () => {
    const { user } = useUserStore();
    const { id } = useParams();
    const { state } = useLocation();


    const dayMatch = dayColors.find((day) => day.day === state.day);

    return (
        <div className="h-full overflow-x-hidden md:h-screen overflow-y-scroll flex flex-col md:p-8 p-6">
            <Header user={user!} />

            

            <MealsSection dietId={id!} dayMatch={dayMatch!} state={state} />
        </div>
    );
};
