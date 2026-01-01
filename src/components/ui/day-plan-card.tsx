import { cn, today } from "@/lib/utils";
import { Day } from "@/model/day";
import type { Meal } from "@/model/meal";
import { UserRole, type User } from "@/model/user";
import type { WorkoutExercise } from "@/model/workout-exercise";
import {
    BatteryCharging,
    Book1,
    Edit,
    RecordCircle,
    Timer1,
    Weight,
} from "iconsax-reactjs";
import { useNavigate } from "react-router-dom";
import { Button } from "./button";

type Variant = "workout" | "diet";

type Props = {
    id: string;
    clientId: number;
    day: Day;
    name?: string | null;
    exercises?: WorkoutExercise[];
    meals?: Meal[];
    restDay?: boolean;
    variant: Variant;
    note?: string;
    openEdit?: () => void;
    user: User;
};

export function DayPlanCard({
    id,
    clientId,
    day,
    name,
    exercises,
    meals,
    restDay,
    variant,
    note,
    openEdit,
    user,
}: Props) {
    const navigate = useNavigate();

    const isWorkout = variant === "workout";
    const isRestDay = isWorkout && restDay;

    const highlight = variant === "diet" ? "#66A786" : "#FF8C00";

    const totalCalories = meals?.reduce(
        (sum, meal) => sum + (meal.cal ?? 0),
        0
    );

    const totalProtein = meals?.reduce(
        (sum, meal) => sum + (meal.protein ?? 0),
        0
    );

    const openDetails = () => {
        if (isRestDay) return;
        navigate(
            isWorkout
                ? `/client/${id}/workout-details`
                : `/client/${id}/diet-details`,
            {
                state: {
                    workout: isWorkout
                        ? { id, name, day, note, exercises, restDay, clientId }
                        : null,
                    diet: !isWorkout
                        ? {
                              id,
                              name,
                              clientId,
                              day,
                              meals,
                          }
                        : null,
                },
            }
        );
    };

    return (
        <div
            className={cn(
                "relative cursor-pointer bg-secondary overflow-hidden rounded-3xl",
                isRestDay
                    ? "cursor-default"
                    : "cursor-pointer hover:scale-101 transition-all",
                today === day ? "border-2 border-foreground" : "border-0"
            )}
            onClick={openDetails}
        >
            <div className="p-5 flex-col flex">
                <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                        <div
                            style={{
                                backgroundColor: isRestDay
                                    ? "#181818"
                                    : highlight,
                                borderColor: isRestDay ? "#181818" : highlight,
                            }}
                            className="flex h-10 w-10 items-center justify-center squircle-round"
                        >
                            {variant === "diet" ? (
                                <Book1 variant="Bold" size={21} color="#fff" />
                            ) : (
                                <>
                                    {isRestDay ? (
                                        <BatteryCharging
                                            variant="Bold"
                                            size={21}
                                            color="#fff"
                                        />
                                    ) : (
                                        <Weight
                                            variant="Bold"
                                            size={21}
                                            color="#fff"
                                        />
                                    )}
                                </>
                            )}
                        </div>

                        <div>
                            <p className="text-sm capitalize text-muted-foreground">
                                {day?.toLowerCase()}
                            </p>
                            {variant === "workout" ? (
                                <h3 className="leading-tight">
                                    {isRestDay
                                        ? "Rest Day"
                                        : name
                                        ? name
                                        : "N/A"}
                                </h3>
                            ) : (
                                <h3 className="leading-tight">
                                    {name ? name : "N/A"}
                                </h3>
                            )}
                        </div>
                    </div>

                    {day === today && (
                        <div className="px-3 py-1 rounded-lg text-xs bg-foreground flex justify-center items-center text-background">
                            Today's
                        </div>
                    )}
                </div>

                <div className="mt-6 flex items-center justify-between">
                    {isRestDay ? (
                        <p className="text-sm flex items-center gap-x-1 text-muted-foreground">
                            <Timer1 variant="Bold" size={21} color="#181818" />
                            <span className="flex items-center gap-x-1">
                                Rest day{" "}
                                <RecordCircle
                                    variant="Bulk"
                                    size={7}
                                    color="#000"
                                />{" "}
                                Recovery
                            </span>
                        </p>
                    ) : (
                        <div>
                            <p className="text-sm text-muted-foreground">
                                <span className="text-foreground">
                                    {variant === "diet"
                                        ? meals?.length
                                        : exercises?.length}
                                </span>{" "}
                                {isWorkout
                                    ? "Exercises planned"
                                    : "Meals planned"}
                            </p>

                            {variant === "diet" && (
                                <div className="flex items-center gap-x-1.5">
                                    <p className="text-sm text-muted-foreground">
                                        <span className="text-foreground">
                                            {totalCalories}
                                        </span>
                                        kcal
                                    </p>
                                    <RecordCircle
                                        variant="Bulk"
                                        size={7}
                                        color="#000"
                                    />

                                    <p className="text-sm text-muted-foreground">
                                        <span className="text-foreground">
                                            {totalProtein}
                                        </span>
                                        g protein
                                    </p>
                                </div>
                            )}
                        </div>
                    )}

                    <div className="flex items-center gap-x-1.5">
                        {user.role === UserRole.TRAINER && (
                            <Button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    openEdit?.();
                                }}
                                variant="outline"
                            >
                                Edit{" "}
                                <Edit variant="Bold" size={18} color="#000" />
                            </Button>
                        )}
                    </div>
                </div>
            </div>

            {/* <div className="mt-2 px-5 flex items-center gap-x-1.5 justify-end text-sm font-medium text-primary"></div> */}
        </div>
    );
}
