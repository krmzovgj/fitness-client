import { getDietByClient } from "@/api/diet";
import { getWorkoutsByClient } from "@/api/workout";
import { DayPlanCard } from "@/components/ui/day-plan-card";
import { Spinner } from "@/components/ui/spinner";
import { today } from "@/lib/utils";
import { useAuthStore } from "@/store/auth";
import { useDietStore } from "@/store/diet";
import { useUserStore } from "@/store/user";
import { useWorkoutStore } from "@/store/workout";
import { RecordCircle } from "iconsax-reactjs";
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

            {todaysWorkout && todaysDiet && (
                <div className="mt-5 flex flex-col  md:grid grid-cols-4 gap-4">
                    <DayPlanCard
                        day={todaysWorkout?.day!}
                        id={todaysWorkout?.id!}
                        clientId={user?.id!}
                        user={user!}
                        variant="workout"
                        exercises={todaysWorkout?.workoutExercises}
                        name={todaysWorkout?.name}
                        restDay={todaysWorkout?.restDay}
                    />

                    <DayPlanCard
                        day={todaysDiet?.day!}
                        id={todaysDiet?.id!}
                        clientId={user?.id!}
                        user={user!}
                        variant="diet"
                        meals={todaysDiet?.meals}
                        name={todaysDiet?.name}
                    />
                </div>
                // )} : (
                //     <div className="mt-5 flex flex-col  md:grid grid-cols-4 gap-4">
                //         {/* {!todaysWorkout && (
                //             <div className="relative cursor-pointer bg-secondary overflow-hidden rounded-3xl">
                //                 <Empty>
                //                     <EmptyContent>
                //                         <EmptyMedia>
                //                             <Weight
                //                                 variant="Bold"
                //                                 size={21}
                //                                 color="#000"
                //                             />
                //                         </EmptyMedia>

                //                         <EmptyTitle>
                //                             No workout for today
                //                         </EmptyTitle>
                //                         <EmptyDescription>
                //                             Your trainer hasn't created a workout
                //                             for {today.toLowerCase()} yet.
                //                         </EmptyDescription>
                //                     </EmptyContent>
                //                 </Empty>
                //             </div>
                //         )} */}
                //     </div>
            )}
        </div>
    );
};
