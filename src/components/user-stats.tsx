import type { User } from "@/model/user";
import { Calendar2, RulerPen, WeightMeter } from "iconsax-reactjs";

export const UserStats = ({ client }: { client: User }) => {
    return (
        <div
            className="flex mt-5 md:mt-0 overflow-x-auto gap-x-4
                scrollbar-hide 
                [-ms-overflow-style:none] [scrollbar-width:none] 
                [&::-webkit-scrollbar]:hidden"
        >
            <div className="p-4 min-w-40 shrink-0 rounded-2xl  overflow-hidden  relative bg-background border-3 border-foreground">
                <h3 className="text-foreground  ">
                    Weight
                    <div className="flex gap-x-0.5 items-end">
                        <div className="font-semibold text-3xl">
                            {client?.weight}
                        </div>
                        <div className="text-lg font-semibold text-foreground/70">
                            kg
                        </div>
                    </div>
                </h3>

                <WeightMeter
                    className="absolute -right-3 -bottom-3"
                    variant="Bulk"
                    size={70}
                    color="#000"
                />
            </div>

            <div className="p-4 min-w-40 shrink-0 rounded-2xl  overflow-hidden  relative bg-background border-3 border-foreground">
                <h3 className="text-foreground  ">
                    Height
                    <div className="flex gap-x-0.5 items-end">
                        <div className="font-semibold text-3xl">
                            {client?.height} 
                        </div>
                        <div className="text-lg font-semibold text-foreground/70">
                            cm
                        </div>
                    </div>
                </h3>

                <RulerPen
                    className="absolute -right-3 -bottom-3"
                    variant="Bulk"
                    size={70}
                    color="#000"
                />
            </div>

            <div className="p-4 min-w-40 shrink-0 rounded-2xl  overflow-hidden  relative bg-background border-3 border-foreground">
                <h3 className="text-foreground  ">
                    Age
                    <div className="flex items-center">
                        <div className="font-semibold text-3xl">
                            {client?.age}
                        </div>
                    </div>
                </h3>

                <Calendar2
                    className="absolute -right-3 -bottom-3"
                    variant="Bulk"
                    size={70}
                    color="#000"
                />
            </div>
        </div>
    );
};
