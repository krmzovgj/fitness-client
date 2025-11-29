import { addClient, getClients } from "@/api/client";
import { clientColumns } from "@/components/client-columns";
import { DataTable } from "@/components/client-table";
import { Button } from "@/components/ui/button";
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
    EmptyContent,
    EmptyDescription,
    EmptyHeader,
    EmptyMedia,
    EmptyTitle,
} from "@/components/ui/empty";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { useClientStore } from "@/store/client";
import { Flash, Profile2User } from "iconsax-reactjs";
import { useEffect, useState } from "react";
import { Header } from "../components/header";
import { UserRole, type User } from "../model/user";
import { useAuthStore } from "../store/auth";
import { useUserStore } from "../store/user";
import { WorkoutSection } from "@/components/workout-section";
import { getWorkout } from "@/api/workout";
import { getExercisesByWorkout } from "@/api/exercise";
import { sortExercisesByDay } from "@/lib/utils";
import type { Exercise } from "@/model/exercise";

export const Home = () => {
    const { token } = useAuthStore();
    const { user } = useUserStore();
    const { clients, setClients } = useClientStore();

    const [workout, setworkout] = useState<any>();
    const [exercises, setExercises] = useState<Exercise[]>([]);

    const [loadingClients, setloadingClients] = useState(false);
    const [creatingClient, setcreatingClient] = useState(false);

    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [weight, setWeight] = useState<number>();
    const [height, setHeight] = useState<number>();
    const [age, setAge] = useState<number>();
    const [gender, setGender] = useState("");
    const [password, setPassword] = useState("");
    const [open, setOpen] = useState(false);
    const [error, seterror] = useState("");

    const handleGetClients = async () => {
        const response = await getClients(token!);

        setClients(response.data);
    };

    useEffect(() => {
        try {
            setloadingClients(true);
            if (user?.role === UserRole.TRAINER) {
                handleGetClients();
            }
        } catch (error) {
        } finally {
            setloadingClients(false);
        }
    }, [user]);

    const handleAddClient = async () => {
        try {
            setcreatingClient(true);

            const payload = {
                firstName,
                lastName,
                email,
                age,
                gender,
                weight,
                height,
                role: UserRole.CLIENT,
                password,
            };

            const response = await addClient(token!, payload);
            if (response.status === 201) {
                handleGetClients();
                setOpen(false);
            }
        } catch (error: any) {
            if (error.response?.data?.message) {
                seterror(error.response.data.message[0]);
            }
        } finally {
            setcreatingClient(false);
        }
    };

    useEffect(() => {
        if (!user || user.role === UserRole.TRAINER) return;
        const fetchWorkout = async () => {
            try {
                const response = await getWorkout(token!, user.id);
                setworkout(response.data);
            } catch (err) {
                console.error(err);
            }
        };
        fetchWorkout();
    }, [user, token]);

    useEffect(() => {
        if (!user || !workout || user.role === UserRole.TRAINER) return;
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

    if(!user) {
        return <div className="flex items-center justify-center h-screen">
            Internal Error. Try again later
        </div>
    }

    return (
        <>
            <Dialog open={open} onOpenChange={setOpen}>
                <div className="h-full overflow-y-scroll md:h-screen w-screen md:p-10 p-8">
                    <Header user={user!} />

                    <div className="mt-20">
                        <div className="flex items-center justify-between">
                            <div>
                                <h1 className="text-3xl font-bold">
                                    Hello {user?.firstName},
                                </h1>
                                {user?.role === UserRole.TRAINER ? (
                                    <h3 className="text-sm md:text-md font-medium text-foreground/80 flex items-center gap-x-1 mt-1 -ml-0.5">
                                        <Flash
                                            variant="Bold"
                                            size={18}
                                            color="#000"
                                        />{" "}
                                        Track your clients and their plans
                                    </h3>
                                ) : (
                                    <h3 className="text-sm md:text-md font-medium text-foreground/80 flex items-center gap-x-1 mt-1 -ml-0.5">
                                        <Flash
                                            variant="Bold"
                                            size={18}
                                            color="#000"
                                        />{" "}
                                        Track your daily workout and diet plan
                                    </h3>
                                )}
                            </div>
                        </div>

                        {user?.role === UserRole.TRAINER && (
                            <div className="mt-14">
                                <div className="flex items-center justify-between">
                                    <h2 className="text-2xl flex items-center gap-x-3 font-semibold text-foreground">
                                        My Clients
                                        {loadingClients && (
                                            <Spinner className="size-6" />
                                        )}
                                    </h2>
                                    <DialogTrigger
                                        asChild
                                        className="rounded-xl"
                                    >
                                        <Button variant="default">
                                            Add Client
                                        </Button>
                                    </DialogTrigger>
                                </div>

                                <div className="mt-5">
                                    {clients?.length === 0 ? (
                                        <Empty>
                                            <EmptyHeader>
                                                <EmptyMedia variant="icon">
                                                    <Profile2User
                                                        variant="Bold"
                                                        size={20}
                                                        color="#000"
                                                    />
                                                </EmptyMedia>
                                                <EmptyTitle>
                                                    No Clients Yet
                                                </EmptyTitle>
                                                <EmptyDescription>
                                                    You haven&apos;t added any
                                                    clients yet. Get started by
                                                    adding your first client.
                                                </EmptyDescription>
                                            </EmptyHeader>
                                            <EmptyContent>
                                                <div className="flex gap-2">
                                                    <Button variant="default">
                                                        Add Client
                                                    </Button>
                                                </div>
                                            </EmptyContent>
                                        </Empty>
                                    ) : (
                                        <>
                                            {!loadingClients && (
                                                <DataTable<User>
                                                    columns={clientColumns}
                                                    data={clients || []}
                                                />
                                            )}
                                        </>
                                    )}
                                </div>
                            </div>
                        )}

                        {user?.role === UserRole.CLIENT && (
                            <WorkoutSection
                                exercises={exercises}
                                role={user.role}
                                workout={workout}
                            />
                        )}
                    </div>

                    <DialogContent>
                        <DialogTitle>Add New Client</DialogTitle>
                        <DialogDescription>
                            Fill the required fields to add a new client
                        </DialogDescription>

                        <div className="grid gap-4">
                            <Input
                                placeholder="Firstname"
                                value={firstName}
                                onChange={(e) => setFirstName(e.target.value)}
                            />
                            <Input
                                placeholder="Lastname"
                                value={lastName}
                                onChange={(e) => setLastName(e.target.value)}
                            />
                            <Input
                                placeholder="Email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                            <Input
                                placeholder="Weight (kg)"
                                value={weight}
                                type="number"
                                onChange={(e) =>
                                    setWeight(Number(e.target.value))
                                }
                            />
                            <Input
                                placeholder="Height (cm)"
                                value={height}
                                type="number"
                                onChange={(e) =>
                                    setHeight(Number(e.target.value))
                                }
                            />
                            <Input
                                placeholder="Age"
                                value={age}
                                type="number"
                                onChange={(e) => setAge(Number(e.target.value))}
                            />
                            <Input
                                placeholder="Gender"
                                value={gender}
                                onChange={(e) => setGender(e.target.value)}
                            />
                            <Input
                                placeholder="Password"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />

                            {error !== "" && (
                                <div className="text-red-500 mt-2 text-sm">
                                    {error}
                                </div>
                            )}
                        </div>

                        <DialogFooter>
                            <Button onClick={handleAddClient} variant="default">
                                {creatingClient ? (
                                    <Spinner color="#fff" />
                                ) : (
                                    <>Add Client</>
                                )}
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </div>
            </Dialog>
        </>
    );
};
