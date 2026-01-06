import { createGlobalExercise, searchExercises } from "@/api/exercise";
import { getWorkoutById, updateWorkout } from "@/api/workout";
import {
    createWorkoutExercise,
    getExercisesByWorkout,
    reorderWorkoutExercise,
    updateWorkoutExercise,
} from "@/api/workout-exercise";
// import {
//     ExerciseColumns,
//     getAllOrderValues,
//     toggleEditOrders,
// } from "@/components/columns/exercise-columns";
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
    Dialog,
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
import { InputBadge } from "@/components/ui/input-badge";
import { MandatoryWrapper } from "@/components/ui/mandatory-input-wrapper";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { Spinner } from "@/components/ui/spinner";
import { Textarea } from "@/components/ui/textarea";
import { cn, hasDuplicateOrders } from "@/lib/utils";
import type { Exercise } from "@/model/exercise";
import { UserRole } from "@/model/user";
import type { Workout } from "@/model/workout";
import type { WorkoutExercise } from "@/model/workout-exercise";
import { useAuthStore } from "@/store/auth";
import { useUserStore } from "@/store/user";
import { motion } from "framer-motion";
import {
    AddCircle,
    ArchiveBox,
    ArrowLeft,
    ArrowSwapVertical,
    CloseCircle,
    RecordCircle,
    TickCircle,
} from "iconsax-reactjs";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { WorkoutNote } from "./workout-note";

export const WorkoutDetailsView = ({
    clientName,
    workoutId,
}: {
    clientName: string;
    workoutId: string;
}) => {
    const { user } = useUserStore();
    const { token } = useAuthStore();
    const navigate = useNavigate();

    const [workout, setWorkout] = useState<Workout | null>(null);
    const [workoutExercises, setworkoutExercises] = useState<WorkoutExercise[]>(
        []
    );
    const [loadingWorkout, setloadingWorkout] = useState(false);
    const [loadingExercises, setloadingExercises] = useState(false);

    const [sets, setsets] = useState<number>(0);
    const [reps, setreps] = useState<string>("");
    const [weight, setweight] = useState<number>(0);
    const [note, setnote] = useState<string>("");
    const [restBetweenSets, setrestBetweenSets] = useState<string>("");
    const [restAfterExercise, setrestAfterExercise] = useState<string>("");

    const [searchQuery, setsearchQuery] = useState("");
    const [debouncedQuery, setDebouncedQuery] = useState("");
    const [exerciseOptions, setexerciseOptions] = useState<Exercise[]>([]);
    const [exerciseListOpen, setexerciseListOpen] = useState(false);
    const [loadingOptions, setloadingOptions] = useState(false);
    const [selectedOptionExercise, setselectedOptionExercise] =
        useState<Exercise | null>(null);

    const [savingOrder, setsavingOrder] = useState(false);
    const [editOrder, seteditOrder] = useState(false);
    const [dialogOpen, setdialogOpen] = useState(false);
    const [error, seterror] = useState("");
    const [creatingExercise, setcreatingExercise] = useState(false);
    const [selectedExercise, setselectedExercise] =
        useState<WorkoutExercise | null>(null);

    const filteredOptions = exerciseOptions.filter((exercise) =>
        exercise.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const [editOrders, setEditOrders] = useState(false);
    const [orderValues, setOrderValues] = useState<Record<string, number>>({});
    const [ordersError, setordersError] = useState<string | null>(null);

    const getWorkoutData = async (showPageLoader = false) => {
        if (!token) return;

        if (showPageLoader) setloadingWorkout(true);
        else setloadingExercises(true);

        try {
            const workoutResponse = await getWorkoutById(token, workoutId);
            setWorkout(workoutResponse.data);

            const exercisesResponse = await getExercisesByWorkout(
                token,
                workoutId
            );
            setworkoutExercises(exercisesResponse.data);
        } catch {
        } finally {
            if (showPageLoader) setloadingWorkout(false);
            else setloadingExercises(false);
        }
    };

    useEffect(() => {
        if (!token) return;
        getWorkoutData(true);
    }, [token, workoutId]);

    const toggleEditOrders = () => {
        setEditOrders((prev) => {
            const newEdit = !prev;
            if (newEdit) setOrderValues({});
            return newEdit;
        });
    };

    const getAllOrderValues = () =>
        Object.entries(orderValues).map(([id, orderNumber]) => ({
            id,
            orderNumber,
        }));

    const handleEditOrders = () => {
        toggleEditOrders?.();
        seteditOrder(true);
    };

    const handleSaveOrders = async () => {
        if (!token || !getAllOrderValues) return;

        const items = getAllOrderValues();

        try {
            setsavingOrder(true);
            await reorderWorkoutExercise(token, workout?.id!, { items });
        } finally {
            setsavingOrder(false);
            seteditOrder(false);
            toggleEditOrders?.();
        }

        await getWorkoutData();
    };

    const handleCancelOrders = () => {
        seteditOrder(false);
        toggleEditOrders?.();
    };

    const handleSearchExercises = async (query: string) => {
        if (!token) return;
        setloadingOptions(true);
        try {
            const response = await searchExercises(
                user?.tenantId!,
                token,
                query
            );
            setexerciseOptions(response.data);
        } finally {
            setloadingOptions(false);
        }
    };

    useEffect(() => {
        if (!token) return;
        if (!exerciseListOpen) return;
        if (searchQuery === "") return;

        const timeout = setTimeout(() => {
            setDebouncedQuery(searchQuery);
            handleSearchExercises(searchQuery);
        }, 300);

        return () => clearTimeout(timeout);
    }, [searchQuery, exerciseListOpen, token]);

    const handleCreateExercise = async () => {
        if (!token) return;
        try {
            setcreatingExercise(true);

            const lastOrder =
                workoutExercises && workoutExercises.length > 0
                    ? workoutExercises[workoutExercises.length - 1].orderNumber
                    : 0;

            const response = await createWorkoutExercise(
                {
                    reps,
                    sets,
                    weight,
                    note,
                    restBetweenSets,
                    restAfterExercise,
                    orderNumber: lastOrder + 1,
                    exerciseId: selectedOptionExercise?.id!,
                },
                token,
                workout?.id!
            );

            if (response.status === 201) {
                const createdExercise = response.data as WorkoutExercise;
                setworkoutExercises((prev) => [...prev, createdExercise]);
                setdialogOpen(false);
            }
        } catch (error: any) {
            const msg = error.response?.data?.message;
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
            weight,
            note,
            restBetweenSets,
            restAfterExercise,
            exerciseId: selectedOptionExercise?.id!,
        };

        try {
            setcreatingExercise(true);

            const response = await updateWorkoutExercise(
                selectedExercise?.id!,
                payload,
                token
            );

            if (response.status === 200) {
                const updatedExercise = response.data as WorkoutExercise;
                setworkoutExercises((prev) =>
                    prev.map((ex) =>
                        ex.id === updatedExercise.id ? updatedExercise : ex
                    )
                );
                setdialogOpen(false);
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
        setrestBetweenSets(selectedExercise?.restBetweenSets!);
        setrestAfterExercise(selectedExercise?.restAfterExercise!);
        setsearchQuery(selectedExercise.exercise.name);
        setselectedOptionExercise(selectedExercise.exercise);
        setnote(selectedExercise?.note!);
    }, [selectedExercise]);

    useEffect(() => {
        if (hasDuplicateOrders(orderValues)) {
            setordersError("Two or more exercises have the same order number");
        } else {
            setordersError(null);
        }
    }, [orderValues]);

    if (loadingWorkout) {
        return (
            <div className="h-screen flex justify-center items-center">
                <Spinner className="size-6" />
            </div>
        );
    }

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
                setweight(0);
                setreps("");
                setnote("");
                setrestAfterExercise("");
                setrestBetweenSets("");
                seterror("");
            }}
        >
            <motion.div
                initial={{
                    y: 30,
                    opacity: 0,
                    filter: "blur(20px)",
                }}
                animate={{
                    y: 0,
                    opacity: 1,
                    filter: "blur(0px)",
                }}
                transition={{
                    duration: 0.5,
                    type: "spring",
                }}
                className="flex items-end justify-between"
            >
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
                            <img
                                src="/weightOrange.svg"
                                className="w-7 h-7"
                                alt=""
                            />
                        </div>
                        <div>
                            <div>
                                <h3 className="flex ml-0.5 items-center capitalize gap-x-2 font-medium">
                                    <p className="text-foreground">
                                        {workout?.day?.toLowerCase()}
                                    </p>
                                    <RecordCircle
                                        variant="Bold"
                                        size={8}
                                        color="#000"
                                    />
                                    <p className="text-foreground">
                                        {clientName}
                                    </p>
                                </h3>
                                <h1 className="text-3xl leading-7 font-medium">
                                    {workout?.name}
                                </h1>
                            </div>
                        </div>
                    </div>
                </div>
            </motion.div>

            <div className="flex mt-10 items-center justify-between">
                <h1 className="text-xl md:text-2xl flex items-center gap-x-1 md:gap-x-2">
                    <RecordCircle variant="Bold" size={20} color="#000" />
                    Exercises
                    {loadingExercises && <Spinner className="size-5" />}
                </h1>

                {user?.role === UserRole.TRAINER && (
                    <div className="flex items-center gap-x-2">
                        {!editOrder ? (
                            <Button
                                disabled={workoutExercises?.length === 0}
                                variant="outline"
                                onClick={handleEditOrders}
                            >
                                <ArrowSwapVertical
                                    variant="Linear"
                                    size={20}
                                    color="#000"
                                />
                            </Button>
                        ) : (
                            <>
                                <Button
                                    className="px-2"
                                    variant="outline"
                                    onClick={handleCancelOrders}
                                >
                                    <CloseCircle
                                        variant="Bold"
                                        size={20}
                                        color="red"
                                    />
                                </Button>
                                <Button
                                    disabled={ordersError !== null}
                                    animate={
                                        ordersError !== null ? false : true
                                    }
                                    className="px-2"
                                    variant="outline"
                                    onClick={handleSaveOrders}
                                >
                                    {savingOrder ? (
                                        <Spinner className="size-5" />
                                    ) : (
                                        <TickCircle
                                            variant="Bold"
                                            size={20}
                                            color="#000"
                                        />
                                    )}
                                </Button>
                            </>
                        )}

                        <DialogTrigger asChild>
                            <Button>
                                <AddCircle
                                    variant="Bold"
                                    size={20}
                                    color="#fff"
                                />{" "}
                                Exercise
                            </Button>
                        </DialogTrigger>
                    </div>
                )}
            </div>

            <div className="mt-5 flex flex-col ">
                <div className="flex flex-col">
                    {workoutExercises?.length === 0 && !loadingExercises ? (
                        <Empty className="">
                            <EmptyHeader>
                                <EmptyMedia variant="icon">
                                    <ArchiveBox
                                        variant="Bulk"
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
                            data={workoutExercises ?? []}
                            columns={ExerciseColumns(
                                setselectedExercise,
                                setdialogOpen,
                                setworkoutExercises,
                                editOrders,
                                orderValues,
                                setOrderValues
                            )}
                        />
                    )}

                    {ordersError && (
                        <div className="text-sm mt-5 text-red-500">
                            {ordersError}
                        </div>
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
                            await getWorkoutData();
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
                            <PopoverTrigger className=" w-full" asChild>
                                <Button
                                    animate={false}
                                    variant="outline"
                                    className="relative justify-between px-3 h-10"
                                >
                                    <span className="absolute text-red-500 left-0 -top-2 text-2xl">
                                        *
                                    </span>
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

                            <PopoverContent side="bottom" className="p-0">
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
                                                <CommandEmpty className="p-4">
                                                    {searchQuery === "" ? (
                                                        <h3 className="text-sm text-center text-foreground">
                                                            Search for an
                                                            exercise
                                                        </h3>
                                                    ) : (
                                                        <>
                                                            <h3 className="text-sm text-center">
                                                                Not listed? Add
                                                                your exercise
                                                            </h3>

                                                            {debouncedQuery !==
                                                                "" &&
                                                                !loadingOptions &&
                                                                exerciseOptions.length ===
                                                                    0 && (
                                                                    <Button
                                                                        onClick={async () => {
                                                                            if (
                                                                                !token
                                                                            )
                                                                                return;
                                                                            await createGlobalExercise(
                                                                                user?.tenantId!,
                                                                                token,
                                                                                searchQuery
                                                                            );
                                                                            await handleSearchExercises(
                                                                                searchQuery
                                                                            );
                                                                        }}
                                                                        variant="outline"
                                                                        className="border-dashed border-2 mt-4 w-full"
                                                                    >
                                                                        <span className="text-muted-foreground mr-1">
                                                                            Add
                                                                        </span>
                                                                        {
                                                                            searchQuery
                                                                        }
                                                                    </Button>
                                                                )}
                                                        </>
                                                    )}
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

                        <MandatoryWrapper>
                            <div className="flex items-center relative">
                                <Input
                                    value={sets === 0 ? "" : sets}
                                    onChange={(e) => {
                                        const value = e.target.value;
                                        setsets(
                                            value === "" ? 0 : Number(value)
                                        );
                                    }}
                                    placeholder="Sets"
                                    type="number"
                                />
                                <InputBadge title="sets" />
                            </div>
                        </MandatoryWrapper>

                        <MandatoryWrapper>
                            <div className="flex items-center relative">
                                <Input
                                    value={reps}
                                    onChange={(e) => setreps(e.target.value)}
                                    placeholder="Reps"
                                />
                                <InputBadge title="reps" />
                            </div>
                        </MandatoryWrapper>

                        <div className="flex items-center relative">
                            <Input
                                value={weight === 0 ? "" : weight}
                                onChange={(e) => {
                                    const value = e.target.value;
                                    setweight(value === "" ? 0 : Number(value));
                                }}
                                placeholder="Weight"
                                type="number"
                            />
                            <InputBadge title="weight kg" />
                        </div>

                        <div className="flex items-center relative">
                            <Input
                                value={restBetweenSets}
                                onChange={(e) => {
                                    setrestBetweenSets(e.target.value);
                                }}
                                placeholder="Rest e.g. 40s / 1min"
                            />

                            <InputBadge title="between sets" />
                        </div>

                        <div className="flex items-center relative">
                            <Input
                                value={restAfterExercise}
                                onChange={(e) => {
                                    setrestAfterExercise(e.target.value);
                                }}
                                placeholder="Rest e.g. 3-5min"
                            />
                            <InputBadge title="after exercise" />
                        </div>

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
