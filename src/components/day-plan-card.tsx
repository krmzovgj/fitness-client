import { cn } from "@/lib/utils";
import { Day } from "@/model/day";
import { UserRole, type User } from "@/model/user";
import {
    Book,
    Edit,
    Maximize4,
    RecordCircle,
    Timer1,
    Weight
} from "iconsax-reactjs";
import { useNavigate } from "react-router-dom";
import { Button } from "./ui/button";

type Variant = "workout" | "diet";

type Props = {
    id: string;
    day: Day;
    name?: string | null;
    count: number;
    restDay?: boolean;
    variant: Variant;
    openEdit?: () => void;
    user: User;
};

export function DayPlanCard({
    id,
    day,
    name,
    count,
    restDay,
    variant,
    openEdit,
    user,
}: Props) {
    const navigate = useNavigate();

    const isWorkout = variant === "workout";
    const isRestDay = isWorkout && restDay;
    const now = new Date();
    const today = now
        .toLocaleDateString("en-US", { weekday: "long" })
        .toUpperCase();

    const highlight = variant === "diet" ? "#66A786" : "#FF8C00";

    return (
        <div
            className={cn(
                "relative bg-secondary overflow-hidden rounded-3xl pb-5"
            )}
            style={{
                borderWidth: today === day ? "2px" : "0px",
                borderColor: today === day ? "#181818" : "transparent",
            }}
        >
            <div className="p-5 flex-col flex">
                <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                        <div
                            style={{
                                backgroundColor: isRestDay
                                    ? "#1818181A"
                                    : highlight + "1A",
                                borderColor: isRestDay ? "#181818" : highlight,
                            }}
                            className="flex h-10 w-10 items-center justify-center squircle-round"
                        >
                            {variant === "diet" ? (
                                <Book
                                    variant="Bold"
                                    size={20}
                                    color={highlight}
                                />
                            ) : (
                                <Weight
                                    variant="Bold"
                                    size={20}
                                    color={isRestDay ? "#181818" : highlight}
                                />
                            )}
                        </div>

                        <div>
                            <p className="text-sm text-muted-foreground">
                                {day}
                            </p>
                            <h3 className="leading-tight">
                                {name || (isWorkout ? "Workout" : "Diet")}
                            </h3>
                        </div>
                    </div>

                    {day === today && (
                        <div className="px-3 py-1 rounded-lg text-xs bg-foreground flex justify-center items-center text-background">
                            Today's
                        </div>
                    )}
                </div>

                <div className="mt-6">
                    {isRestDay ? (
                        <p className="text-sm flex items-center gap-x-1 text-muted-foreground">
                            <Timer1 variant="Bold" size={20} color="#181818" />
                            <span className="flex items-center gap-x-1">Rest day <RecordCircle variant="Bulk" size={7} color="#000" /> Recovery</span>
                        </p>
                    ) : (
                        <p className="text-sm text-muted-foreground">
                            <span className="text-foreground">{count}</span>{" "}
                            {isWorkout ? "Exercises planned" : "Meals planned"}
                        </p>
                    )}
                </div>
            </div>

            <div className="mt-2 px-5 flex items-center gap-x-1.5 justify-end text-sm font-medium text-primary">
                <div className="flex items-center gap-x-1.5">
                    {user.role === UserRole.TRAINER && (
                        <Button onClick={openEdit} variant="outline">
                            Edit <Edit variant="Bold" size={18} color="#000" />
                        </Button>
                    )}

                    <Button
                        disabled={isRestDay}
                        onClick={() => {
                            if (isRestDay) return;
                            navigate(
                                isWorkout
                                    ? `/client/${id}/exercises`
                                    : `/client/${id}/meals`,
                                {
                                    state: { name, day },
                                }
                            );
                        }}
                        variant="outline"
                    >
                        View <Maximize4 variant="Bold" size={18} color="#000" />
                    </Button>
                </div>
            </div>
        </div>
    );
}
