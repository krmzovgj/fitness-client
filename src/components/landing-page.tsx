import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { ArrowRight, Book, Messages2, Profile2User } from "iconsax-reactjs";
import { Button } from "../components/ui/button";
import { GridPattern } from "./ui/shadcn-io/grid-pattern";

export const LandingPage = () => {
    return (
        <>
            <GridPattern
                width={30}
                height={30}
                x={-1}
                y={-1}
                strokeDasharray={"4 2"}
                className={cn(
                    "z-0 mask-[radial-gradient(1000px_circle_at_center,white,transparent)]"
                )}
            />
            <div className="tracking-tighter w-screen md:pb-8 pb-6 px-6 relative">
                <div className="fixed px-6 md:px-0 backdrop-blur-lg z-50 left-0 flex items-center py-5 justify-between md:justify-evenly w-full">
                    <img src="/favicon.png" className="w-10 h-10" alt="" />

                    <div className="hidden md:flex items-center gap-x-5">
                        <p className="cursor-pointer">Home</p>
                        <p className="cursor-pointer">Featues</p>
                        <p className="cursor-pointer">FAQ</p>
                        <p className="cursor-pointer">Contact</p>
                    </div>

                    <Button className="">Get Started</Button>
                </div>
                <div className="mt-40 z-50 md:mt-50">
                    <div className="flex justify-center items-center flex-col text-center">
                        <Badge title="mycoach.mk" className="" />

                        <motion.h1
                            initial={{
                                y: 90,
                                opacity: 0,
                                filter: "blur(20px)",
                            }}
                            animate={{
                                y: 0,
                                opacity: 1,
                                filter: "blur(0px)",
                            }}
                            transition={{ duration: 0.7, type: "spring" }}
                            className="text-4xl leading-9 md:leading-none tracking-tighter mt-5 md:text-6xl font-medium"
                        >
                            Manage Clients, <br className="flex md:hidden" />
                            Workouts & <br className="hidden md:flex" />
                            Nutrition <br className="borderblock md:hidden" />-
                            All in One Place
                        </motion.h1>
                        <motion.h3
                            initial={{
                                y: 60,
                                opacity: 0,
                                filter: "blur(20px)",
                            }}
                            animate={{
                                y: 0,
                                opacity: 1,
                                filter: "blur(0px)",
                            }}
                            transition={{
                                duration: 0.7,
                                type: "spring",
                                delay: 0.1,
                            }}
                            className="mt-8 text-muted-foreground text-md md:w-1/4 w-full"
                        >
                            The all-in-one platform for personal trainers to
                            create workouts, plan diets, and track clients
                            without spreadsheets or chaos.
                        </motion.h3>

                        <Button className="mt-5 w-full ">
                            Get Started{" "}
                            <ArrowRight
                                variant="Linear"
                                size={20}
                                color="#FF8C00"
                            />
                        </Button>
                    </div>

                    <motion.div
                        initial={{ opacity: 0, filter: "blur(20px)" }}
                        animate={{ opacity: 1, filter: "blur(0px)" }}
                        transition={{
                            duration: 0.5,
                            type: "spring",
                        }}
                        className="rounded-xl bg-secondary md:rounded-3xl p-1 md:p-1.5 overflow-hidden justify-center items-center w-full md:w-1/2 flex place-self-center mt-10"
                    >
                        <img
                            src="/platform-hero.png"
                            className="rounded-[20px] shadow-sm"
                            alt=""
                        />
                    </motion.div>
                </div>

                <div className="mt-40 relative flex justify-center items-center flex-col md:mt-50">
                    <Badge title="Features" />
                    <h1 className="text-3xl leading-7 md:leading-none tracking-tighter mt-5 text-center md:text-5xl font-medium">
                        {" "}
                        Built for how coaches <br />
                        actually work
                    </h1>

                    <h3 className="mt-5 text-center text-muted-foreground text-md md:w-1/5 w-full">
                        You don’t need more tools. You need fewer things that
                        work well together - kept simple and clear.
                    </h3>

                    <div className="mt-15 w-full md:w-1/2">
                        <div className="relative rounded-xl bg-secondary p-1 md:p-1.5  md:rounded-3xl">
                            <img
                                className="rounded-[20px] shadow-sm"
                                src="/diet-details.png"
                                alt=""
                            />
                            <div className="absolute h-44 md:h-72 bottom-0 left-0 rounded-[20px] from-background via-background/50 to-transparent bg-linear-to-t w-full"></div>
                        </div>
                        <div className="flex gap-y-10 mt-10 flex-col justify-center">
                            <div className="flex flex-col md:flex-row gap-y-10 md:gap-y-0 items-center gap-x-20">
                                <div className="flex flex-col gap-y-4 gap-x-10  md:w-1/2">
                                    <div className="flex items-center  text-lg gap-x-2">
                                        <div className="w-8 h-8  rounded-lg flex justify-center items-center bg-background border">
                                            <Profile2User
                                                variant="Bulk"
                                                size={20}
                                                color="#000"
                                            />
                                        </div>
                                        Clients
                                    </div>
                                    <h3 className="text-muted-foreground ">
                                        Know where everyone stands, see your
                                        clients and their{" "}
                                        <br className="hidden md:flex" />{" "}
                                        programs without digging through
                                        messages or files.
                                    </h3>
                                </div>

                                <div className="flex flex-col gap-y-4 gap-x-10  md:w-1/2">
                                    <div className="flex items-center text-lg gap-x-2">
                                        <div className="w-8 h-8  rounded-lg flex justify-center items-center bg-background border">
                                            <img
                                                src="/weight.svg"
                                                className="w-5 h-5"
                                                alt=""
                                            />
                                        </div>
                                        Workouts
                                    </div>
                                    <h3 className="text-muted-foreground ">
                                        Create workouts that make sense add
                                        exercises,{" "}
                                        <br className="hidden md:flex" /> sets,
                                        reps, and notes. Change things as
                                        clients progress.
                                    </h3>
                                </div>
                            </div>

                            <div className="flex flex-col md:flex-row gap-y-10 md:gap-y-0 items-center gap-x-20">
                                <div className="flex flex-col gap-y-4 gap-x-10  md:w-1/2">
                                    <div className="flex items-center  text-lg gap-x-2">
                                        <div className="w-8 h-8  rounded-lg flex justify-center items-center bg-background border">
                                            <Messages2
                                                variant="Bulk"
                                                size={20}
                                                color="#000"
                                            />
                                        </div>
                                        Messages
                                    </div>
                                    <h3 className="text-muted-foreground ">
                                        Talk where the work is, communicate with
                                        all your{" "}
                                        <br className="hidden md:flex" />{" "}
                                        clients in one place without switching
                                        apps.
                                    </h3>
                                </div>

                                <div className="flex flex-col gap-y-4 gap-x-10  md:w-1/2">
                                    <div className="flex items-center  text-lg gap-x-2">
                                        <div className="w-8 h-8  rounded-lg flex justify-center items-center bg-background border">
                                            <Book
                                                variant="Bulk"
                                                size={20}
                                                color="#000"
                                            />
                                        </div>
                                        Meals
                                    </div>
                                    <h3 className="text-muted-foreground ">
                                        Plan meals by day, add custom recepies,
                                        macros, meal types
                                        <br className="hidden md:flex" /> and
                                        change things as needed - just like
                                        workouts.
                                    </h3>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};
