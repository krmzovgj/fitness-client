import type { User } from "@/model/user";
import { ArrowSwapHorizontal, Calendar2, RulerPen, WeightMeter } from "iconsax-reactjs";

export const UserStats = ({ client }: { client: User }) => {
    return (
        <div className="flex items-center gap-x-4">
            <div>
                <h3 className="font-medium text-md text-foreground flex items-center gap-x-1">
                    <WeightMeter variant="Bulk" size={18} color="#000" />
                    Weight: <span className="font-semibold">{client?.weight}</span>
                    <span className="text-sm font-semibold text-foreground/70">kg</span>
                </h3>
                <h3 className="font-medium text-md text-foreground flex items-center gap-x-1">
                    <RulerPen variant="Bulk" size={18} color="#000" />
                    Height: <span className="font-semibold">{client?.height}</span>
                    <span className="text-sm font-semibold text-foreground/70">cm</span>
                </h3>
            </div>

            <div>
                <h3 className="font-medium text-md text-foreground flex items-center gap-x-1">
                    <Calendar2 variant="Bulk" size={18} color="#000" />
                    Age: <span className="font-semibold">{client?.age}</span>
                </h3>
                <h3 className="font-medium text-md text-foreground flex items-center gap-x-1">
                    <ArrowSwapHorizontal variant="Bulk" size={18} color="#000" />
                    Gender: <span className="font-semibold">{client?.gender}</span>
                </h3>
            </div>
        </div>
    );
};
