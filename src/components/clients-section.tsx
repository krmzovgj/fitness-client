import { addClient, getClients, updateClient } from "@/api/client";
import { UserRole, type User } from "@/model/user";
import { useAuthStore } from "@/store/auth";
import { useClientStore } from "@/store/client";
import { useUserStore } from "@/store/user";
import { Eye, EyeSlash, Profile2User, RecordCircle } from "iconsax-reactjs";
import { useEffect, useState } from "react";
import { clientColumns } from "./columns/client-columns";
import { DataTable } from "./data-table";
import { Button } from "./ui/button";
import {
    Dialog,
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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "./ui/select";
import { useTenantStore } from "@/store/tenant";

export const ClientsSection = () => {
    const { user } = useUserStore();
    const { token } = useAuthStore();
    const { clients, setClients } = useClientStore();
    const { tenant } = useTenantStore();

    const [loadingClients, setloadingClients] = useState(false);
    const [creatingClient, setcreatingClient] = useState(false);
    const [selectedClient, setselectedClient] = useState<User | null>(null);
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [weight, setWeight] = useState<number>();
    const [height, setHeight] = useState<number>();
    const [age, setAge] = useState<number>();
    const [gender, setGender] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setshowPassword] = useState(false);
    const [open, setOpen] = useState(false);
    const [error, seterror] = useState("");

    const handleGetClients = async () => {
        try {
            setloadingClients(true);

            if (user?.role === UserRole.CLIENT || !tenant) return;

            const response = await getClients(token!, tenant?.id);

            setClients(response.data);
        } catch (error) {
        } finally {
            setloadingClients(false);
        }
    };

    useEffect(() => {
        handleGetClients();
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
                tenantId: tenant?.id,
                password,
            };

            const response = await addClient(token!, payload);
            if (response.status === 201) {
                handleGetClients();
                setOpen(false);
            }
        } catch (error: any) {
            if (error.response?.data?.message) {
                const msg = error.response.data.message;

                if (Array.isArray(msg)) {
                    seterror(msg[0]);
                } else {
                    seterror(msg);
                }
            }
        } finally {
            setcreatingClient(false);
        }
    };

    const handleUpdateClient = async () => {
        if (!selectedClient) return;
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
            };

            const response = await updateClient(
                selectedClient?.id,
                token!,
                payload
            );
            if (response.status === 200) {
                handleGetClients();
                setOpen(false);
            }
        } catch (error: any) {
            if (error.response?.data?.message) {
                const msg = error.response.data.message;

                if (Array.isArray(msg)) {
                    seterror(msg[0]);
                } else {
                    seterror(msg);
                }
            }
        } finally {
            setcreatingClient(false);
        }
    };

    useEffect(() => {
        if (!selectedClient) return;

        setFirstName(selectedClient.firstName);
        setLastName(selectedClient.lastName);
        setEmail(selectedClient.email);
        setAge(selectedClient.age);
        setWeight(selectedClient.weight);
        setHeight(selectedClient.height);
        setGender(selectedClient.gender);
    }, [selectedClient]);

    return (
        <Dialog
            open={open}
            onOpenChange={(open) => {
                setOpen(open);
                setselectedClient(null);
                setFirstName("");
                setLastName("");
                setAge(0);
                setHeight(0);
                setWeight(0);
                setEmail("");
                setGender("");
                setPassword("");
            }}
        >
            <div className="flex h-full flex-col">
                {user?.role === UserRole.TRAINER && (
                    <div className="h-full flex flex-col mt-14">
                        <div className="flex items-center justify-between">
                            <h2 className="text-xl md:text-2xl flex items-center gap-x-1 md:gap-x-2">
                                <RecordCircle
                                    variant="Bold"
                                    size={20}
                                    color="#000"
                                />
                                My Clients
                                {loadingClients && (
                                    <Spinner className="size-6" />
                                )}
                            </h2>
                            <DialogTrigger asChild className="rounded-xl">
                                <Button variant="default">Add Client</Button>
                            </DialogTrigger>
                        </div>

                        {!loadingClients && (
                            <div className="mt-5 flex flex-col ">
                                {clients?.length === 0 ? (
                                    <Empty>
                                        <EmptyHeader>
                                            <EmptyMedia variant="icon">
                                                <Profile2User
                                                    variant="Bold"
                                                    size={20}
                                                    color="#fff"
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
                                    </Empty>
                                ) : (
                                    <DataTable<User>
                                        enableSorting={true}
                                        columns={clientColumns(
                                            setselectedClient,
                                            setOpen,
                                            handleGetClients
                                        )}
                                        data={clients || []}
                                    />
                                )}
                            </div>
                        )}
                    </div>
                )}
            </div>

            <DialogContent>
                <DialogTitle>
                    {selectedClient ? "Update" : "Add New"} Client
                </DialogTitle>
                <DialogDescription>
                    Fill the required fields to{" "}
                    {selectedClient ? "update" : "add"} a client
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
                        type="number"
                        value={weight === 0 ? "" : weight}
                        onChange={(e) => {
                            const value = e.target.value;
                            setWeight(value === "" ? 0 : Number(value));
                        }}
                    />
                    <Input
                        placeholder="Height (cm)"
                        type="number"
                        value={height === 0 ? "" : height}
                        onChange={(e) => {
                            const value = e.target.value;
                            setHeight(value === "" ? 0 : Number(value));
                        }}
                    />
                    <Input
                        placeholder="Age"
                        type="number"
                        value={age === 0 ? "" : age}
                        onChange={(e) => {
                            const value = e.target.value;
                            setAge(value === "" ? 0 : Number(value));
                        }}
                    />

                    <Select onValueChange={setGender} value={gender}>
                        <SelectTrigger>
                            <SelectValue placeholder="Gender" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value={"MALE"}>
                                <div className="flex items-center gap-x-2">
                                    <div
                                        className="w-2 h-2 rounded-full"
                                        style={{
                                            backgroundColor: "#66A786",
                                        }}
                                    ></div>
                                    <h2>MALE</h2>
                                </div>
                            </SelectItem>

                            <SelectItem value={"FEMALE"}>
                                <div className="flex items-center gap-x-2">
                                    <div
                                        className="w-2 h-2 rounded-full"
                                        style={{
                                            backgroundColor: "#9B5DE5",
                                        }}
                                    ></div>
                                    <h2>FEMALE</h2>
                                </div>
                            </SelectItem>
                        </SelectContent>
                    </Select>

                    {!selectedClient && (
                        <div className="relative">
                            <Input
                                type={showPassword ? "text" : "password"}
                                placeholder="Password"
                                value={password}
                                onChange={(e: any) =>
                                    setPassword(e.target.value)
                                }
                                className="pr-10"
                            />

                            <button
                                type="button"
                                onClick={() => setshowPassword(!showPassword)}
                                className="absolute cursor-pointer right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                            >
                                {showPassword ? (
                                    <EyeSlash
                                        variant="Linear"
                                        size={20}
                                        color="#000"
                                    />
                                ) : (
                                    <Eye
                                        variant="Linear"
                                        size={20}
                                        color="#000"
                                    />
                                )}
                            </button>
                        </div>
                    )}

                    {error !== "" && (
                        <div className="text-red-500 mt-2 text-sm">
                            {error.charAt(0).toUpperCase() + error.slice(1)}
                        </div>
                    )}
                </div>

                <DialogFooter>
                    <Button
                        className="self-end"
                        onClick={
                            selectedClient
                                ? handleUpdateClient
                                : handleAddClient
                        }
                        variant="default"
                    >
                        {creatingClient ? (
                            <Spinner color="#fff" />
                        ) : (
                            <>{!selectedClient ? "Add" : "Update"} Client</>
                        )}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};
