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

export const Home = () => {
    const { token } = useAuthStore();
    const { user } = useUserStore();
    const { clients, setClients } = useClientStore();
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
                                    <h3 className="text-md font-medium text-foreground/80 flex items-center gap-x-1 mt-1 -ml-0.5">
                                        <Flash
                                            variant="Bold"
                                            size={18}
                                            color="#000"
                                        />{" "}
                                        Track your clients and their plans
                                    </h3>
                                ) : (
                                    <h3 className="text-md font-medium text-foreground/80 flex items-center gap-x-1 mt-1 -ml-0.5">
                                        <Flash
                                            variant="Bold"
                                            size={18}
                                            color="#000"
                                        />{" "}
                                        Track your daily workout and diet plan
                                    </h3>
                                )}
                            </div>

                            <DialogTrigger asChild className="rounded-xl">
                                <Button variant="default">Add Client</Button>
                            </DialogTrigger>
                        </div>

                        {user?.role === UserRole.TRAINER && (
                            <div className="mt-14">
                                <h2 className="text-2xl flex items-center gap-x-3 font-semibold text-foreground">
                                    My Clients
                                    {loadingClients && (
                                        <Spinner className="size-6" />
                                    )}
                                </h2>

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

                        {error !== '' && (
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
