import { Header } from "@/components/header";
import { dayColors } from "@/lib/utils";
import { useAuthStore } from "@/store/auth";
import { useUserStore } from "@/store/user";
import { ArrowLeft } from "iconsax-reactjs";
import { useLocation, useNavigate, useParams } from "react-router-dom";

export const Exercises = () => {
    const navigate = useNavigate();
    const { user } = useUserStore();
    const { token } = useAuthStore();
    console.log("🚀 ~ Exercises ~ token:", token)
    const { id } = useParams();
    console.log("🚀 ~ Exercises ~ id:", id)

    const { state } = useLocation();
    const dayMatch = dayColors.find((day) => day.day === state.day)

    return (
        <div className="h-full overflow-x-hidden md:h-screen overflow-y-scroll flex flex-col w-screen md:p-10 p-8">
            <Header user={user!} />

            <div className="mt-20 mb-10 md:mb-0">
                <ArrowLeft
                    className="cursor-pointer"
                    onClick={() => navigate(-1)}
                    variant="Bold"
                    size={30}
                    color="#000"
                />
                <h3 className="mt-4 text-md font-bold flex items-center gap-x-2 ml-0.5 text-foreground/80">
                    <div className="w-2 h-2 rounded-full " style={{backgroundColor: dayMatch?.color}} />
                    {state?.day}
                </h3>
                <h1 className="text-3xl font-bold">{state?.name}</h1>
            </div>
        </div>
    );
};
