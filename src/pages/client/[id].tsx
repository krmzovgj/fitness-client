import { getDietByClient } from "@/api/diet";
import {
    createExercise,
    deleteExercise,
    getExercisesByWorkout,
    updateExercise,
} from "@/api/exercise";
import { createMeal, getMeals } from "@/api/meal";
import { getUserById } from "@/api/user";
import { getWorkout } from "@/api/workout";
import { DataTable } from "@/components/client-table";
import { Header } from "@/components/header";
import { getMealColumns } from "@/components/meal-columns";
import { AlertDialogFooter } from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
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
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Spinner } from "@/components/ui/spinner";
import { UserStats } from "@/components/ui/user-stats";
import { WorkoutSection } from "@/components/workout-section";
import { dayColors, mealTypes, sortExercisesByDay } from "@/lib/utils";
import { Day, type Exercise } from "@/model/exercise";
import { Type, type Meal } from "@/model/meal";
import { UserRole, type User } from "@/model/user";
import { useAuthStore } from "@/store/auth";
import { useUserStore } from "@/store/user";
import { ArrowLeft, Receipt } from "iconsax-reactjs";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

export const Client = () => {
    const navigate = useNavigate();
    const { user } = useUserStore();
    const { token } = useAuthStore();
    const { id } = useParams();

    const [name, setname] = useState("");
    const [description, setdescription] = useState("");
    const [cal, setcal] = useState<number>(0);
    const [protein, setprotein] = useState<number>(0);
    const [day, setday] = useState<Day>(Day.MONDAY);
    const [submitting, setsubmitting] = useState(false);
    const [type, settype] = useState<Type>(Type.BREKFAST);
    const [error, seterror] = useState("");

    const [openDialog, setOpenDialog] = useState(false);
    const [client, setClient] = useState<User | null>(null);
    const [workout, setWorkout] = useState<any>();
    const [diet, setdiet] = useState<any>();
    const [exercises, setExercises] = useState<Exercise[]>([]);
    const [meals, setmeals] = useState<Meal[]>([]);
    const [loadingClient, setLoadingClient] = useState(false);

    useEffect(() => {
        if (!id) return;
        const fetchClient = async () => {
            try {
                setLoadingClient(true);
                const response = await getUserById(id, token!);
                setClient(response.data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoadingClient(false);
            }
        };
        fetchClient();
    }, [id, token]);

    useEffect(() => {
        if (!client) return;
        const fetchWorkout = async () => {
            try {
                const response = await getWorkout(token!, client.id);
                setWorkout(response.data);
            } catch (err) {
                console.error(err);
            }
        };
        fetchWorkout();
    }, [client, token]);

    useEffect(() => {
        if (!workout) return;
        const fetchExercises = async () => {
            try {
                const response = await getExercisesByWorkout(
                    token!,
                    workout.id
                );
                const sorted = sortExercisesByDay(response.data);
                setExercises(sorted);
            } catch (err) {
                console.error(err);
            }
        };
        fetchExercises();
    }, [workout, token]);

    useEffect(() => {
        const handleGetDiet = async () => {
            try {
                const response = await getDietByClient(client?.id!, token!);
                setdiet(response.data);
            } catch (error) {}
        };

        handleGetDiet();
    }, [client, token]);

    useEffect(() => {
        const handleGetMeals = async () => {
            try {
                const response = await getMeals(token!, diet.id);
                setmeals(response.data);
            } catch (error) {}
        };

        handleGetMeals();
    }, [diet, token]);

    const handleCreateMeal = () => {
        try {
            setsubmitting(true);
            createMeal(
                {
                    name,
                    description,
                    cal,
                    protein,
                    day,
                    type,
                    dietId: diet.id,
                },
                token!
            );
        } catch (error) {
        } finally {
            setsubmitting(false);
        }
    };

    return (
        <div className="h-full overflow-x-hidden md:h-screen overflow-y-scroll flex flex-col w-screen md:p-10 p-8">
            <Header user={user!} />

            {loadingClient ? (
                <div className="h-full flex justify-center items-center">
                    <Spinner className="size-6" />
                </div>
            ) : (
                <>
                    <div className="flex md:flex-row flex-col items-start md:items-end gap-x-20">
                        <div className="mt-20 mb-10 md:mb-0">
                            <ArrowLeft
                                className="cursor-pointer"
                                onClick={() => navigate("/")}
                                variant="Bold"
                                size={30}
                                color="#000"
                            />
                            <h3 className="mt-4 text-md font-bold flex items-center gap-x-2 ml-0.5 text-foreground/80">
                                <div className="w-2 h-2 rounded-full bg-[#66A786]" />
                                {client?.role}
                            </h3>
                            <h1 className="text-3xl font-bold">
                                {client?.firstName} {client?.lastName}
                            </h1>
                        </div>

                        <UserStats client={client!} />
                    </div>

                    <WorkoutSection
                        role={user?.role!}
                        workout={workout}
                        exercises={exercises}
                        onCreate={async (payload) => {
                            await createExercise(payload, token!);
                            const updated = await getExercisesByWorkout(
                                token!,
                                workout.id
                            );
                            setExercises(sortExercisesByDay(updated.data));
                        }}
                        onUpdate={async (id, payload) => {
                            await updateExercise(id, payload, token!);
                            const updated = await getExercisesByWorkout(
                                token!,
                                workout.id
                            );
                            setExercises(sortExercisesByDay(updated.data));
                        }}
                        onDelete={async (exercise) => {
                            await deleteExercise(exercise.id, token!);
                            const updated = await getExercisesByWorkout(
                                token!,
                                workout.id
                            );
                            setExercises(sortExercisesByDay(updated.data));
                        }}
                    />

                    <div className="mt-14">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-x-2">
                                <div className="w-1 h-5 bg-[#FF6B6B] rounded-full"></div>
                                <h1 className="text-2xl">{diet?.name}</h1>
                            </div>

                            <Dialog
                                open={openDialog}
                                onOpenChange={setOpenDialog}
                            >
                                {user?.role === UserRole.TRAINER && (
                                    <DialogTrigger asChild>
                                        <Button
                                            onClick={() => {
                                                setOpenDialog(true);
                                            }}
                                        >
                                            Create Exercise
                                        </Button>
                                    </DialogTrigger>
                                )}

                                <DialogContent>
                                    <DialogTitle>Create Meal</DialogTitle>
                                    <DialogDescription>
                                        Fill the required fields to create meal
                                    </DialogDescription>

                                    <div className="grid gap-4 mt-4">
                                        <Input
                                            placeholder="Name"
                                            value={name}
                                            onChange={(e) =>
                                                setname(e.target.value)
                                            }
                                        />

                                        <Input
                                            placeholder="Description"
                                            value={description}
                                            onChange={(e) =>
                                                setdescription(e.target.value)
                                            }
                                        />

                                        <Input
                                            placeholder="Cal"
                                            type="number"
                                            value={cal === 0 ? "" : cal}
                                            onChange={(e) =>
                                                setcal(Number(e.target.value))
                                            }
                                        />
                                        <Input
                                            placeholder="Protein"
                                            type="number"
                                            value={protein === 0 ? "" : protein}
                                            onChange={(e) =>
                                                setprotein(
                                                    Number(e.target.value)
                                                )
                                            }
                                        />

                                        <Select
                                            value={type}
                                            onValueChange={(v) =>
                                                settype(v as Type)
                                            }
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select Type" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {mealTypes.map((t) => (
                                                    <SelectItem
                                                        key={t.type}
                                                        value={t.type}
                                                    >
                                                        <span className="whitespace-nowrap flex items-center gap-x-2">
                                                            <div
                                                                style={{
                                                                    backgroundColor:
                                                                        t?.color,
                                                                }}
                                                                className="w-2 h-2 rounded-full"
                                                            />
                                                            {t.type}
                                                        </span>
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>

                                        <Select
                                            value={day}
                                            onValueChange={(v) =>
                                                setday(v as Day)
                                            }
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select Day" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {dayColors.map((d) => (
                                                    <SelectItem
                                                        key={d.day}
                                                        value={d.day}
                                                    >
                                                        <span className="whitespace-nowrap flex items-center gap-x-2">
                                                            <div
                                                                style={{
                                                                    backgroundColor:
                                                                        d?.color,
                                                                }}
                                                                className="w-2 h-2 rounded-full"
                                                            />
                                                            {d.day}
                                                        </span>
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>

                                        {error && (
                                            <p className="text-red-500 text-sm">
                                                {error}
                                            </p>
                                        )}
                                    </div>

                                    <AlertDialogFooter className="mt-4">
                                        <Button onClick={handleCreateMeal}>
                                            {submitting ? (
                                                <Spinner />
                                            ) : (
                                                "Create Exercise"
                                            )}
                                        </Button>
                                    </AlertDialogFooter>
                                </DialogContent>
                            </Dialog>
                        </div>

                        <div className="mt-5">
                            {meals.length === 0 ? (
                                <Empty>
                                    <EmptyHeader>
                                        <EmptyMedia variant="icon">
                                            <Receipt
                                                variant="Bold"
                                                size={20}
                                                color="#000"
                                            />
                                        </EmptyMedia>
                                        <EmptyTitle>No Meals Yet</EmptyTitle>
                                        <EmptyDescription>
                                            {user?.role === UserRole.TRAINER
                                                ? "You haven’t created any meals yet. Get started by creating their first meal."
                                                : "Your trainer hasn’t created any meals yet. Once they create a plan, it will appear here."}
                                        </EmptyDescription>
                                    </EmptyHeader>
                                </Empty>
                            ) : (
                                <DataTable
                                    columns={getMealColumns({})}
                                    data={meals}
                                />
                            )}
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};
