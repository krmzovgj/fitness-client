import {
    createExercise,
    searchExercises,
    updateExercise,
} from "@/api/exercise";
import { getWorkoutById, updateWorkout } from "@/api/workout";
import { ExerciseColumns } from "@/components/columns/exercise-columns";
import { DataTable } from "@/components/data-table";
import { Button } from "@/components/ui/button";
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command";
import {
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import {
    Empty,
    EmptyDescription,
    EmptyHeader,
    EmptyMedia,
    EmptyTitle,
} from "@/components/ui/empty";
import { Input } from "@/components/ui/input";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { Spinner } from "@/components/ui/spinner";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import type { Day } from "@/model/day";
import type { Exercise } from "@/model/exercise";
import { UserRole } from "@/model/user";
import type { Workout } from "@/model/workout";
import type { WorkoutExercise } from "@/model/workout-exercise";
import { useAuthStore } from "@/store/auth";
import { useUserStore } from "@/store/user";
import { Dialog } from "@radix-ui/react-dialog";
import {
    ArrowLeft,
    ArrowSwapVertical,
    RecordCircle,
    TickCircle,
    Weight,
} from "iconsax-reactjs";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { WorkoutNote } from "./workout-note";

export const WorkoutDetailsView = ({
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

    const [workout, setWorkout] = useState(state?.workout ?? null);
    const [loadingWorkout, setloadingWorkout] = useState(false);

    const [sets, setsets] = useState<number>(0);
    const [reps, setreps] = useState<string>("");
    const [note, setnote] = useState<string>("");

    const [searchQuery, setsearchQuery] = useState("");
    const [exerciseOptions, setexerciseOptions] = useState<Exercise[]>([]);
    const [exerciseListOpen, setexerciseListOpen] = useState(false);
    const [loadingOptions, setloadingOptions] = useState(false);
    const [selectedOptionExercise, setselectedOptionExercise] =
        useState<Exercise | null>(null);

    const [dialogOpen, setdialogOpen] = useState(false);
    const [error, seterror] = useState("");
    const [creatingExercise, setcreatingExercise] = useState(false);
    const [selectedExercise, setselectedExercise] =
        useState<WorkoutExercise | null>(null);

        const filteredOptions = exerciseOptions.filter((exercise) =>
        exercise.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const getWorkout = async () => {
        if (!token) return;

        try {
            setloadingWorkout(true);
            const response = await getWorkoutById(token, workoutId);
            const data = response.data;

            setWorkout({
                ...data,
                exercises: data.workoutExercises ?? [],
            });
        } finally {
            setloadingWorkout(false);
        }
    };

    const handleSearchExercises = async (query: string) => {
        if (!token) return;
        setloadingOptions(true);
        try {
            const response = await searchExercises(token, query);
            setexerciseOptions(response.data);
        } finally {
            setloadingOptions(false);
        }
    };

    useEffect(() => {
        if (!token) return;
        if (!exerciseListOpen) return;
        if (searchQuery === "") return;

        const delay = setTimeout(() => {
            handleSearchExercises(searchQuery);
        }, 300);

        return () => clearTimeout(delay);
    }, [searchQuery, exerciseListOpen, token]);


    const handleCreateExercise = async () => {
        if (!token) return;
        try {
            setcreatingExercise(true);

            const response = await createExercise(
                {
                    reps,
                    sets,
                    note,
                    exerciseId: selectedOptionExercise?.id!,
                },
                token,
                workoutId
            );

            if (response.status === 201) {
                setdialogOpen(false);
                await getWorkout();
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
            sets,
            reps,
            note,
            exerciseId: selectedOptionExercise?.id!,
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
                await getWorkout();
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

        setsets(selectedExercise?.sets!);
        setreps(selectedExercise?.reps!);
        setsearchQuery(selectedExercise.exercise.name);
        setselectedOptionExercise(selectedExercise.exercise);
        setnote(selectedExercise?.note!);
    }, [selectedExercise]);

    return (
        <Dialog
            open={dialogOpen}
            onOpenChange={(open) => {
                setdialogOpen(open);
                setselectedExercise(null);
                setsearchQuery("");
                setselectedOptionExercise(null);
                setexerciseOptions([]);
                setsets(0);
                setreps("");
                setnote("");
                seterror("");
            }}
        >
            <div className="flex items-end justify-between">
                <div className="mt-10">
                    <div className="flex items-center gap-x-3">
                        <Button
                            onClick={() => navigate(-1)}
                            variant="ghost"
                            className="bg-secondary"
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

                    <div className="flex mt-5  items-center gap-x-3">
                        <div className="flex w-14 h-14  bg-foreground items-center justify-center squircle-round">
                            <Weight variant="Bold" size={28} color="#FF8C00" />
                        </div>
                        <div>
                            <div>
                                <h3 className="flex ml-0.5 items-center capitalize gap-x-1 font-medium">
                                    <p className="text-foreground">
                                        {dayMatch?.day.toLowerCase()}
                                    </p>{" "}
                                    <p className="text-muted-foreground">
                                        Workout Day
                                    </p>
                                </h3>
                                <h1 className="text-3xl leading-7 font-medium">
                                    {workout?.name}
                                </h1>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="flex mt-10 items-center justify-between">
                <h1 className="text-xl md:text-2xl flex items-center gap-x-1 md:gap-x-2">
                    <RecordCircle variant="Bold" size={20} color="#000" />
                    Exercises
                    {loadingWorkout && <Spinner className="size-5" />}
                </h1>

                {user?.role === UserRole.TRAINER && (
                    <DialogTrigger asChild>
                        <Button>Add Exercise</Button>
                    </DialogTrigger>
                )}
            </div>

            <div className="mt-5 flex flex-col ">
                <div className="flex flex-col">
                    {workout?.exercises?.length === 0 ? (
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
                            enableSorting
                            data={workout?.exercises ?? []}
                            columns={ExerciseColumns(
                                setselectedExercise,
                                setdialogOpen,
                                getWorkout
                            )}
                        />
                    )}

                    <WorkoutNote
                        note={workout?.note!}
                        onSave={async (newNote) => {
                            updateWorkout(workout?.id!, token!, {
                                clientId: workout?.clientId!,
                                day: workout?.day!,
                                restDay: workout?.restDay!,
                                name: workout?.name,
                                note: newNote,
                            });
                            // getWorkout
                            setWorkout(
                                (prev: Workout) =>
                                    prev && { ...prev, note: newNote }
                            );
                        }}
                    />
                </div>

                <DialogContent>
                    <DialogTitle>
                        {selectedExercise ? "Update" : "Add New"} Exercise
                    </DialogTitle>
                    <DialogDescription>
                        Fill the required fields to{" "}
                        {selectedExercise ? "update" : "add"} an exercise
                    </DialogDescription>

                    <div className="flex flex-col gap-y-2 mt-2">
                        <Popover
                            open={exerciseListOpen}
                            onOpenChange={setexerciseListOpen}
                        >
                            <PopoverTrigger asChild>
                                <Button
                                    variant="outline"
                                    className="justify-between px-3 h-10"
                                >
                                    {selectedOptionExercise ? (
                                        <p className="text-foreground">
                                            {selectedOptionExercise.name}
                                        </p>
                                    ) : (
                                        <p className="text-muted-foreground">
                                            Select exercise
                                        </p>
                                    )}
                                    <ArrowSwapVertical
                                        variant="Bulk"
                                        size={20}
                                        color="#000"
                                    />
                                </Button>
                            </PopoverTrigger>

                            <PopoverContent className="p-0">
                                <Command>
                                    <CommandInput
                                        placeholder="Search exercise e.g. Bench Press"
                                        className="h-9"
                                        value={searchQuery}
                                        onValueChange={setsearchQuery}
                                    />
                                    <CommandList>
                                        {loadingOptions ? (
                                            <div className=" text-sm flex p-6 justify-center items-center gap-x-2 text-foreground">
                                                <Spinner
                                                    className="size-4"
                                                    color="#000"
                                                />
                                                Loading...
                                            </div>
                                        ) : (
                                            <>
                                                <CommandEmpty>
                                                    No results found...
                                                </CommandEmpty>

                                                <CommandGroup>
                                                    {filteredOptions.map(
                                                        (exercise) => (
                                                            <CommandItem
                                                                className="cursor-pointer"
                                                                key={
                                                                    exercise.id
                                                                }
                                                                value={
                                                                    exercise.name
                                                                }
                                                                onSelect={() => {
                                                                    setselectedOptionExercise(
                                                                        exercise
                                                                    );
                                                                    setexerciseListOpen(
                                                                        false
                                                                    );
                                                                }}
                                                            >
                                                                {exercise.name}
                                                                <TickCircle
                                                                    variant="Bold"
                                                                    size={20}
                                                                    className={cn(
                                                                        "ml-auto",
                                                                        selectedOptionExercise?.id ===
                                                                            exercise.id
                                                                            ? "opacity-100"
                                                                            : "opacity-0"
                                                                    )}
                                                                />
                                                            </CommandItem>
                                                        )
                                                    )}
                                                </CommandGroup>
                                            </>
                                        )}
                                    </CommandList>
                                </Command>
                            </PopoverContent>
                        </Popover>

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

                        <Textarea
                            rows={5}
                            className="resize-none"
                            value={note}
                            onChange={(e) => setnote(e.target.value)}
                            placeholder="Additional Exercise Note..."
                        />

                        {error !== "" && (
                            <div className="text-red-500 mt-2 text-sm">
                                {error.charAt(0).toUpperCase() + error.slice(1)}
                            </div>
                        )}
                    </div>

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
                                <Spinner color="#fff" className="size-6" />
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
