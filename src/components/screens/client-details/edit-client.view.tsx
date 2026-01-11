import { updateClient } from "@/api/client";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { InputBadge } from "@/components/ui/input-badge";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Spinner } from "@/components/ui/spinner";
import { Switch } from "@/components/ui/switch";
import type { User } from "@/model/user";
import { useAuthStore } from "@/store/auth";
import { Label } from "@radix-ui/react-dropdown-menu";
import { Edit } from "iconsax-reactjs";
import { useEffect, useState } from "react";

export const EditClientView = ({
    client,
    fetchClient,
}: {
    client: User;
    fetchClient: () => void;
}) => {
    const { token } = useAuthStore();

    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setemail] = useState("");
    const [weight, setWeight] = useState<number>(0);
    const [height, setHeight] = useState<number>(0);
    const [age, setAge] = useState<number>(0);
    const [workoutPlan, setworkoutPlan] = useState<boolean>(true);
    const [dietPlan, setdietPlan] = useState<boolean>(true);
    const [gender, setGender] = useState("");
    const [open, setopen] = useState(false);
    const [error, seterror] = useState("");
    const [updatingClient, setupdatingClient] = useState(false);

    useEffect(() => {
        setFirstName(client?.firstName!);
        setLastName(client?.lastName!);
        setemail(client.email);
        setWeight(client?.weight!);
        setHeight(client?.height!);
        setAge(client?.age!);
        setGender(client.gender);
        setworkoutPlan(!!client.workoutPlan!);
        setdietPlan(!!client.dietPlan!);
    }, [open, client]);

    const handleUpdateClient = async () => {
        if (!client) return;
        try {
            setupdatingClient(true);

            const payload = {
                firstName,
                lastName,
                email,
                age,
                gender,
                weight,
                height,
                workoutPlan,
                dietPlan,
            };

            const response = await updateClient(client?.id, token!, payload);
            if (response.status === 200) {
                fetchClient();
                setopen(false);
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
            setupdatingClient(false);
        }
    };

    return (
        <Dialog
            open={open}
            onOpenChange={(open) => {
                setopen(open);
                setFirstName("");
                setLastName("");
                setAge(0);
                setHeight(0);
                setWeight(0);
                setemail("");
                setGender("");
                setworkoutPlan(false);
                setdietPlan(false);
                seterror("");
            }}
        >
            <DialogTrigger asChild>
                <Button variant="outline" className="p-2">
                    <Edit
                        className="cursor-pointer"
                        variant="Bold"
                        size={18}
                        color="#000"
                    />
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogTitle>Update {client.firstName}</DialogTitle>
                <DialogDescription>
                    Fill the required fields to update a client
                </DialogDescription>

                <div className="flex flex-col gap-y-2 mt-2">
                    <Input
                        className="capitalize"
                        placeholder="Firstname"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                    />
                    <Input
                        className="capitalize"
                        placeholder="Lastname"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                    />
                    <Input
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setemail(e.target.value)}
                    />

                    <div className="flex items-center relative">
                        <Input
                            placeholder="Weight (kg)"
                            type="number"
                            value={weight === 0 ? "" : weight}
                            onChange={(e) => {
                                const value = e.target.value;
                                setWeight(value === "" ? 0 : Number(value));
                            }}
                        />
                        <InputBadge title="weight" />
                    </div>

                    <div className="flex items-center relative">
                        <Input
                            placeholder="Height (cm)"
                            type="number"
                            value={height === 0 ? "" : height}
                            onChange={(e) => {
                                const value = e.target.value;
                                setHeight(value === "" ? 0 : Number(value));
                            }}
                        />
                        <InputBadge title="height" />
                    </div>

                    <div className="flex items-center relative">
                        <Input
                            placeholder="Age"
                            type="number"
                            value={age === 0 ? "" : age}
                            onChange={(e) => {
                                const value = e.target.value;
                                setAge(value === "" ? 0 : Number(value));
                            }}
                        />
                        <InputBadge title="age" />
                    </div>
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

                    <div className="flex ml-0.5 mt-1 items-center space-x-2">
                        <Switch
                            checked={workoutPlan}
                            onCheckedChange={(includesWorkoutPlan) =>
                                setworkoutPlan(!!includesWorkoutPlan)
                            }
                        />
                        <Label>Workout Plan</Label>
                    </div>

                    <div className="flex ml-0.5 items-center space-x-2">
                        <Switch
                            checked={dietPlan}
                            onCheckedChange={(includesDietPlan) =>
                                setdietPlan(!!includesDietPlan)
                            }
                        />
                        <Label>Diet Plan</Label>
                    </div>
                </div>

                {error !== "" && (
                    <div className="text-red-500 mt-2 text-sm">
                        {error.charAt(0).toUpperCase() + error.slice(1)}
                    </div>
                )}

                <DialogFooter>
                    <Button
                        className="self-end"
                        onClick={handleUpdateClient}
                        variant="default"
                    >
                        {updatingClient ? (
                            <Spinner color="#fff" className="size-6" />
                        ) : (
                            <>Update Client</>
                        )}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};
