import { Badge } from "@/components/ui/badge";
import { Button } from "../components/ui/button";
import { motion } from "framer-motion";
import { GridPattern } from "./ui/shadcn-io/grid-pattern";
import { cn } from "@/lib/utils";

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
            <div className="w-screen md:pb-8 pb-6 px-6 relative">
                <div className="flex items-center py-5 justify-between md:justify-evenly w-full">
                    <img src="/favicon.png" className="w-10 h-10" alt="" />

                    <div className="hidden md:flex items-center gap-x-5">
                        <p className="cursor-pointer">Home</p>
                        <p className="cursor-pointer">Featues</p>
                        <p className="cursor-pointer">FAQ</p>
                        <p className="cursor-pointer">Contact</p>
                    </div>

                    <Button className="">Get Started</Button>
                </div>

                <div className="mt-20 z-50 md:mt-28">
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
                            className="text-4xl mt-5 md:text-6xl font-medium"
                        >
                            Manage Clients, <br className="flex md:hidden" />{" "}
                            Workouts & <br className="hidden md:flex" />
                            Nutrition <br className="flex md:hidden" />- All in
                            One Place
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
                            className="mt-8 text-black/60 text-md md:w-1/4 w-full"
                        >
                            The all-in-one platform for personal trainers to
                            create workouts, plan diets, and track clients
                            without spreadsheets or chaos.
                        </motion.h3>

                        <Button className="mt-5">Get Started</Button>
                    </div>

                    <motion.div
                        initial={{ opacity: 0, filter: "blur(20px)" }}
                        animate={{ opacity: 1, filter: "blur(0px)" }}
                        transition={{
                            duration: 0.7,
                            type: "spring",
                            delay: 0.2,
                        }}
                        className="rounded-xl md:rounded-3xl p-1 md:p-1.5 overflow-hidden justify-center items-center border-2 md:border-[3px] w-full md:w-2/3 border-black flex place-self-center mt-10"
                    >
                        <img src="/platform-hero.png" className="" alt="" />
                    </motion.div>
                </div>
            </div>
        </>
    );
};
