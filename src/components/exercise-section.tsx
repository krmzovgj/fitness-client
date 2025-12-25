import {
    createExercise,
    getExercisesByWorkout,
    updateExercise,
} from "@/api/exercise";
import type { Day } from "@/model/day";
import type { Exercise } from "@/model/exercise";
import { UserRole } from "@/model/user";
import { useAuthStore } from "@/store/auth";
import { useUserStore } from "@/store/user";
import { Dialog } from "@radix-ui/react-dialog";
import { ArrowLeft, Weight } from "iconsax-reactjs";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ExerciseColumns } from "./columns/exercise-columns";
import { DataTable } from "./data-table";
import { Button } from "./ui/button";
import {
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogTitle,
    DialogTrigger,
} from "./ui/dialog";
import {
    Empty,
    EmptyDescription,
    EmptyHeader,
    EmptyMedia,
    EmptyTitle,
} from "./ui/empty";
import { Input } from "./ui/input";
import { Spinner } from "./ui/spinner";

export const ExerciseSection = ({
    workoutId,
    dayMatch,
    state,
}: {
    workoutId: string;
    dayMatch: { day: Day; color: string };
    state: any;
}) => {
    const { user } = useUserStore();
    const { token } = useAuthStore();
    const navigate = useNavigate();

    const [exercises, setexercises] = useState<Exercise[]>([]);

    const [name, setname] = useState("");
    const [sets, setsets] = useState<number>(0);
    const [reps, setreps] = useState("");

    const [dialogOpen, setdialogOpen] = useState(false);
    const [error, seterror] = useState("");
    const [creatingExercise, setcreatingExercise] = useState(false);
    const [selectedExercise, setselectedExercise] = useState<Exercise | null>(
        null
    );
    const [loadingExercises, setloadingExercises] = useState(true);

    const handleGetExercisesByWorkout = async () => {
        if (!token) return;
        try {
            const response = await getExercisesByWorkout(token, workoutId);
            setexercises(response.data);
        } catch (error) {
        } finally {
            setloadingExercises(false);
        }
    };

    useEffect(() => {
        handleGetExercisesByWorkout();
    }, [workoutId, token]);

    const handleCreateExercise = async () => {
        if (!token) return;
        try {
            setcreatingExercise(true);

            const response = await createExercise(
                { name, reps, sets, workoutId },
                token
            );

            if (response.status === 201) {
                setdialogOpen(false);
                handleGetExercisesByWorkout();
            }
        } catch (error: any) {
            const msg = error.response.data.message;

            if (Array.isArray(msg)) {
                seterror(msg[0]);
            } else {
                seterror(msg);
            }
        } finally {
            setcreatingExercise(false);
        }
    };

    const handleUpdateExercise = async () => {
        if (!token) return;

        const payload = {
            name,
            sets,
            reps,
            actualPerformance: selectedExercise?.actualPerformance,
        };

        try {
            setcreatingExercise(true);

            const response = await updateExercise(
                selectedExercise?.id!,
                payload,
                token
            );

            if (response.status === 200) {
                setdialogOpen(false);
                handleGetExercisesByWorkout();
            }
        } catch (error: any) {
            const msg = error.response.data.message;

            if (Array.isArray(msg)) {
                seterror(msg[0]);
            } else {
                seterror(msg);
            }
        } finally {
            setcreatingExercise(false);
        }
    };

    useEffect(() => {
        if (!selectedExercise) return;

        setname(selectedExercise?.name!);
        setsets(selectedExercise?.sets!);
        setreps(selectedExercise?.reps!);
    }, [selectedExercise]);

    return (
        <Dialog
            open={dialogOpen}
            onOpenChange={(open) => {
                setdialogOpen(open);
                setselectedExercise(null);
                setname("");
                setsets(0);
                setreps("");
                seterror("");
            }}
        >
            <div className="flex items-end justify-between">
                <div className="mt-20">
                    <div className="flex items-center gap-x-3">
                        <Button
                            onClick={() => navigate(-1)}
                            variant="ghost"
                            className="bg-muted/50"
                        >
                            <ArrowLeft
                                className="cursor-pointer"
                                variant="Linear"
                                size={20}
                                color="#000"
                            />
                            Back
                        </Button>
                    </div>

                    <h3 className="mt-4 text-md font-bold flex items-center gap-x-2 ml-0.5 text-foreground/80">
                        <div
                            className="w-2 h-2 rounded-full "
                            style={{ backgroundColor: dayMatch?.color }}
                        />
                        {dayMatch?.day}
                    </h3>
                    <h1 className="text-3xl font-bold">{state.name}</h1>
                </div>
                {user?.role === UserRole.TRAINER && (
                    <DialogTrigger>
                        <Button>Add Exercise</Button>
                    </DialogTrigger>
                )}
            </div>

            <div className="mt-5 flex flex-col ">
                {loadingExercises ? (
                    <div className="flex justify-center items-center">
                        <Spinner className="size-6" />
                    </div>
                ) : (
                    <div className="flex flex-col">
                        {exercises.length === 0 ? (
                            <Empty className="">
                                <EmptyHeader>
                                    <EmptyMedia variant="icon">
                                        <Weight
                                            variant="Bold"
                                            size={20}
                                            color="#fff"
                                        />
                                    </EmptyMedia>
                                    <EmptyTitle>No Exercises Yet</EmptyTitle>
                                    <EmptyDescription>
                                        {user?.role === UserRole.TRAINER
                                            ? "No exercises created yet. Once you create an exercise it will appear here"
                                            : "No exercises yet. Once your trainer creates an exercise it will appear here"}
                                    </EmptyDescription>
                                </EmptyHeader>
                            </Empty>
                        ) : (
                            <DataTable
                                enableSorting={true}
                                data={exercises}
                                columns={ExerciseColumns(
                                    setselectedExercise,
                                    setdialogOpen,
                                    handleGetExercisesByWorkout
                                )}
                            />
                        )}
                    </div>
                )}

                <DialogContent>
                    <DialogTitle>
                        {selectedExercise ? "Update" : "Add New"} Exercise
                    </DialogTitle>
                    <DialogDescription>
                        Fill the required fields to{" "}
                        {selectedExercise ? "update" : "add"} an exercise
                    </DialogDescription>

                    <Input
                        value={name}
                        onChange={(e) => setname(e.target.value)}
                        placeholder="Name e.g. Bench Press"
                    />

                    <Input
                        value={sets === 0 ? "" : sets}
                        onChange={(e) => {
                            const value = e.target.value;
                            setsets(value === "" ? 0 : Number(value));
                        }}
                        placeholder="Sets"
                        type="number"
                    />

                    <Input
                        value={reps}
                        onChange={(e) => setreps(e.target.value)}
                        placeholder="Reps"
                    />

                    {error !== "" && (
                        <div className="text-red-500 mt-2 text-sm">
                            {error.charAt(0).toUpperCase() + error.slice(1)}
                        </div>
                    )}
                    <DialogFooter>
                        <Button
                            onClick={
                                selectedExercise
                                    ? handleUpdateExercise
                                    : handleCreateExercise
                            }
                            className="self-end"
                        >
                            {creatingExercise ? (
                                <Spinner className="size-6" />
                            ) : (
                                <>
                                    {selectedExercise ? "Update" : "Add"}{" "}
                                    Exercise
                                </>
                            )}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </div>
        </Dialog>
    );
};
