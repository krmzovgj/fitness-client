import { cn, today } from "@/lib/utils";
import { Day } from "@/model/day";
import { UserRole, type User } from "@/model/user";
import { motion } from "framer-motion";
import { BatteryCharging, Book1, Edit, Moon, Trash } from "iconsax-reactjs";
import { useNavigate } from "react-router-dom";
import { Button } from "./button";

type Variant = "workout" | "diet";

type Props = {
    id: string;
    firstName: string;
    lastName: string;
    clientId: number;
    day: Day;
    name?: string | null;
    exerciseCount?: number;
    mealsCount?: number;
    restDay?: boolean;
    variant: Variant;
    note?: string;
    openEdit?: () => void;
    openDelete?: () => void;
    user: User;
};

export function DayPlanCard({
    id,
    firstName,
    lastName,
    day,
    name,
    exerciseCount,
    mealsCount,
    restDay,
    variant,
    openEdit,
    openDelete,
    user,
}: Props) {
    const navigate = useNavigate();

    const isWorkout = variant === "workout";
    const isRestDay = isWorkout && restDay;

    const highlight = variant === "diet" ? "#66A786" : "#FF8C00";

    const openDetails = () => {
        if (isRestDay) return;
        navigate(
            isWorkout
                ? `/client/${id}/workout-details`
                : `/client/${id}/diet-details`,
            {
                state: {
                    clientName: firstName + " " + lastName,
                },
            }
        );
    };

    return (
        <motion.div
            whileHover={isRestDay ? undefined : { scale: 1.03 }}
            whileTap={isRestDay ? undefined : { scale: 0.99 }}
            transition={{ type: "spring", duration: 0.4 }}
            className={cn(
                "p-1 relative rounded-3xl bg-secondary transition-colors",
                today === day ? "border-2 border-foreground" : "border-0",
                isRestDay ? "cursor-default" : "cursor-pointer"
            )}
        >
            {day === today && (
                <div className="px-3 py-1 absolute left-[50%] translate-x-[-50%] -top-3 border-2 shadow-sm border-background z-10 rounded-lg text-xs bg-foreground flex justify-center items-center text-background">
                    Today's
                </div>
            )}
            <div
                className={cn(
                    "relative  overflow-hidden bg-background rounded-[20px] shadow-sm"
                )}
                onClick={openDetails}
            >
                {restDay && (
                    <BatteryCharging
                        variant="Bulk"
                        className="absolute -rotate-180 -right-4  -top-5"
                        size={100}
                        color="#181818"
                    />
                )}

                <div className="p-5 flex-col flex">
                    <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                            <div
                                style={{
                                    backgroundColor: isRestDay
                                        ? "oklch(0.97 0 0)"
                                        : "#181818",
                                }}
                                className="flex h-10 w-10 items-center justify-center squircle-round"
                            >
                                {variant === "diet" ? (
                                    <Book1
                                        variant="Bold"
                                        size={21}
                                        color={highlight}
                                    />
                                ) : (
                                    <>
                                        {isRestDay ? (
                                            <BatteryCharging
                                                variant="Bold"
                                                size={21}
                                                color="#000"
                                            />
                                        ) : (
                                            <img
                                                src="/weightOrange.svg"
                                                className="w-[21px] h-[21px]"
                                                alt=""
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
                    </div>

                    <div className="mt-6 flex items-center justify-between">
                        {isRestDay ? (
                            <p className="text-sm flex items-center gap-x-1.5 text-muted-foreground">
                                <Moon
                                    variant="Bulk"
                                    size={16}
                                    color="#181818"
                                />

                                <span className="flex items-center gap-x-1">
                                    Rest day
                                </span>
                            </p>
                        ) : (
                            <div>
                                <p className="text-sm text-muted-foreground">
                                    <span className="text-foreground">
                                        {variant === "diet"
                                            ? mealsCount
                                            : exerciseCount}
                                    </span>{" "}
                                    {isWorkout ? "Exercises" : "Meals"}
                                </p>
                            </div>
                        )}

                        {user.role === UserRole.TRAINER && (
                            <div className="flex items-center gap-x-1.5">
                                <Button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        openEdit?.();
                                    }}
                                    variant="secondary"
                                >
                                    Edit{" "}
                                    <Edit
                                        variant="Bold"
                                        size={18}
                                        color="#000"
                                    />
                                </Button>

                                <Button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        openDelete?.();
                                    }}
                                    variant="secondary"
                                    className="p-3"
                                >
                                    <Trash
                                        variant="Bold"
                                        size={18}
                                        color="red"
                                    />
                                </Button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </motion.div>
    );
}
