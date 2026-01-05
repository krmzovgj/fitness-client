import { getDietByClient } from "@/api/diet";
import { getWorkoutsByClient } from "@/api/workout";
import { DayPlanCard } from "@/components/ui/day-plan-card";
import { Spinner } from "@/components/ui/spinner";
import { today } from "@/lib/utils";
import { useAuthStore } from "@/store/auth";
import { useDietStore } from "@/store/diet";
import { useUserStore } from "@/store/user";
import { useWorkoutStore } from "@/store/workout";
import { ArchiveBox, RecordCircle } from "iconsax-reactjs";
import { useEffect, useState } from "react";

export const TodaysActivityView = () => {
    const { user } = useUserStore();
    const { token } = useAuthStore();
    const { workoutsByClient, setWorkouts } = useWorkoutStore();
    const { mealDaysByClient, setMealDays } = useDietStore();

    const workouts = user?.id ? workoutsByClient[user.id] : undefined;
    const mealDays = user?.id ? mealDaysByClient[user?.id] : undefined;

    const [loadingActivity, setloadingActivity] = useState(false);

    const fetchActivity = async () => {
        if (!token || !user?.id) return;
        if (workouts && mealDays) return;

        setloadingActivity(true);
        try {
            const [workoutRes, dietRes] = await Promise.all([
                getWorkoutsByClient(token, user.id),
                getDietByClient(user.id, token),
            ]);

            setWorkouts(user.id, workoutRes.data);
            setMealDays(user.id, dietRes.data);
        } catch {
        } finally {
            setloadingActivity(false);
        }
    };

    useEffect(() => {
        fetchActivity();
    }, [token, user?.id]);

    const todaysWorkout = workouts?.find((workout) => workout.day === today);
    const todaysDiet = mealDays?.find((diet) => diet.day === today);

    return (
        <div className="mt-10">
            <div className="flex items-center gap-x-2">
                <h1 className="text-xl md:text-2xl flex items-center gap-x-1 md:gap-x-2">
                    <RecordCircle variant="Bold" size={20} color="#000" />
                    Today's Activity
                    {loadingActivity && <Spinner className="size-5" />}
                </h1>
            </div>

            <div className="mt-5 flex flex-col  md:grid grid-cols-4 gap-4">
                {todaysWorkout ? (
                    <DayPlanCard
                        firstName={user?.firstName!}
                        lastName={user?.lastName!}
                        day={todaysWorkout?.day!}
                        id={todaysWorkout?.id!}
                        clientId={user?.id!}
                        user={user!}
                        variant="workout"
                        exerciseCount={todaysWorkout?._count.workoutExercises}
                        name={todaysWorkout?.name}
                        restDay={todaysWorkout?.restDay}
                    />
                ) : (
                    <div className="p-5 rounded-3xl bg-secondary border-dashed border-2">
                        <div className="flex items-center gap-x-3">
                            <div className="h-10 w-10 squircle-round bg-foreground flex justify-center items-center">
                                <ArchiveBox
                                    variant="Bulk"
                                    size={21}
                                    color="#fff"
                                />
                            </div>
                            <div>
                                <p className="text-sm capitalize text-muted-foreground">
                                    {today?.toLowerCase()}
                                </p>
                                <h3>No Workout Yet</h3>
                            </div>
                        </div>
                        <h3 className="mt-6 text-sm text-muted-foreground">
                            Your trainer hasn't created a workout yet
                        </h3>
                    </div>
                )}
                {todaysDiet ? (
                    <DayPlanCard
                        firstName={user?.firstName!}
                        lastName={user?.lastName!}
                        day={todaysDiet?.day!}
                        id={todaysDiet?.id!}
                        clientId={user?.id!}
                        user={user!}
                        variant="diet"
                        mealsCount={todaysDiet?._count.meals}
                        name={todaysDiet?.name}
                    />
                ) : (
                    <div className="p-5 rounded-3xl bg-secondary border-dashed border-2">
                        <div className="flex items-center gap-x-3">
                            <div className="h-10 w-10 squircle-round bg-foreground flex justify-center items-center">
                                <ArchiveBox
                                    variant="Bulk"
                                    size={21}
                                    color="#fff"
                                />
                            </div>
                            <div>
                                <p className="text-sm capitalize text-muted-foreground">
                                    {today?.toLowerCase()}
                                </p>
                                <h3>No Diet Yet</h3>
                            </div>
                        </div>
                        <h3 className="mt-6 text-sm text-muted-foreground">
                            Your trainer hasn't created a diet yet
                        </h3>
                    </div>
                )}
            </div>
        </div>
    );
};
