// import { getWorkoutsByClient } from "@/api/workout";
// import { dayColors } from "@/lib/utils";
// import { useAuthStore } from "@/store/auth";
// import { useUserStore } from "@/store/user";
// import { useWorkoutStore } from "@/store/workout";
// import { ArrowRight } from "iconsax-reactjs"; // Add these icons
// import { useEffect } from "react";
// import { useNavigate } from "react-router-dom"; // or your router

// export const TodaysActivity = () => {
//     const { workouts, setWorkouts } = useWorkoutStore();
//     const { user } = useUserStore();
//     const { token } = useAuthStore();
//     const navigate = useNavigate();

//     const today = new Date();
//     const todayName = today.toLocaleString("en-US", { weekday: "long" });

//     const getWorkoutForDay = (offset: number) => {
//         const date = new Date();
//         date.setDate(today.getDate() + offset);
//         const dayName = date
//             .toLocaleString("en-US", { weekday: "long" })
//             .toUpperCase();
//         return workouts.find((w) => w.day.toUpperCase() === dayName);
//     };

//     const todaysWorkout = getWorkoutForDay(0);

//     useEffect(() => {
//         if (token && user?.id) {
//             getWorkoutsByClient(token, user.id)
//                 .then((res) => setWorkouts(res.data))
//                 .catch(console.error);
//         }
//     }, [token, user]);

//     const getColor = (day: string | undefined) => {
//         if (!day) return "#666";
//         return (
//             dayColors.find((d) => d.day.toUpperCase() === day.toUpperCase())
//                 ?.color || "#666"
//         );
//     };

//     if (workouts.length === 0) {
//         return (
//             <div className="mt-8">
//                 <div className="flex items-center gap-3 mb-6">
//                     <div className="w-1 h-6 bg-foreground rounded-full" />
//                     <h1 className="text-2xl md:text-3xl font-bold">
//                         Your Training Week
//                     </h1>
//                 </div>
//                 <p className="text-muted-foreground">Loading your plan...</p>
//             </div>
//         );
//     }

//     return (
//         <div className="mt-8">
//             <div className="flex items-center gap-x-3 mb-8">
//                 <div className="w-1 h-7 bg-foreground rounded-full" />
//                 <h1 className="text-2xl md:text-3xl font-bold">
//                     Your Training Week
//                 </h1>
//             </div>

//             <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//                 <div
//                     onClick={() =>
//                         todaysWorkout &&
//                         navigate(`/workout/${todaysWorkout.id}`)
//                     }
//                     className="relative p-6 md:p-8 bg-black text-white border-4 border-foreground rounded-3xl cursor-pointer hover:scale-102 transition-all duration-300 min-h-[200px] flex flex-col justify-between"
//                 >
//                     <div>
//                         <div className="flex items-center gap-3 mb-4">
//                             <div
//                                 className="w-5 h-5 rounded-full "
//                                 style={{
//                                     backgroundColor: getColor(
//                                         todaysWorkout?.day
//                                     ),
//                                 }}
//                             />
//                             <span className="text-sm font-bold tracking-wider">
//                                 TODAY
//                             </span>
//                         </div>
//                         <h2 className="text-3xl font-extrabold leading-tight">
//                             {todaysWorkout?.name || "Rest Day"}
//                         </h2>
//                         <p className="text-lg opacity-90">{todayName}</p>
//                     </div>

//                     <ArrowRight
//                         className="absolute bottom-6 right-6"
//                         size={36}
//                     />
//                 </div>

//                 {/* <div
//                     onClick={() => navigate("/workouts")} // change to your route
//                     className="p-8 bg-background relative overflow-hidden border-4 border-foreground rounded-3xl cursor-pointer hover:scale-102 transition-transform duration-300  flex flex-col justify-between min-h-[200px] group"
//                 >
//                     <div>
//                         <div className="flex items-center gap-3 mb-6">
//                             <Weight
//                                 color="#000"
//                                 variant="Bulk"
//                                 className="absolute w-42 h-42 md:w-50 md:h-50 -right-10 -bottom-20  group-hover:rotate-12 transition"
//                             />
//                             <div className="flex w-full items-center justify-between">
//                                 <span className="text-sm font-bold uppercase tracking-wider ">
//                                     Full Program
//                                 </span>
//                                 <ArrowRight
//                                     variant="Linear"
//                                     size={24}
//                                     color="#000"
//                                 />
//                             </div>
//                         </div>
//                         <h3 className="text-2xl font-bold">
//                             View My Workouts
//                         </h3>
//                         <p className=" text-muted-foreground">
//                             See your weekly split
//                         </p>
//                     </div>
//                 </div>

//                 <div
//                     onClick={() => navigate("/diet")} // change to your diet route
//                     className="p-8 relative overflow-hidden bg-background border-4 border-foreground rounded-3xl cursor-pointer hover:scale-102 transition-transform duration-300  flex flex-col justify-between min-h-[200px] group"
//                 >
//                     <div>
//                         <div className="flex items-center gap-3 mb-6">
//                             <Book
//                                 // size={200}
//                                 color="#000"
//                                 variant="Bulk"
//                                 className="absolute w-40 h-40 md:w-50 md:h-50 -right-10 -bottom-20  group-hover:rotate-12 transition"
//                             />
//                             <div className="flex w-full items-center justify-between">
//                                 <span className="text-sm font-bold uppercase tracking-wider">
//                                     Nutrition
//                                 </span>

//                                 <ArrowRight
//                                     variant="Linear"
//                                     size={24}
//                                     color="#000"
//                                 />
//                             </div>
//                         </div>
//                         <h3 className="text-2xl font-bold">View Diet Plan</h3>
//                         <p className="text-muted-foreground">
//                             Meals, macros & timing
//                         </p>
//                     </div>
//                 </div> */}
//             </div>
//         </div>
//     );
// };
