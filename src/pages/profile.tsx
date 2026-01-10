import { getMe, updateUser } from "@/api/user";
import { Avatar } from "@/components/ui/avatar";
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
import { GridPattern } from "@/components/ui/shadcn-io/grid-pattern";
import { Spinner } from "@/components/ui/spinner";
import { cn, formatDate } from "@/lib/utils";
import { useAuthStore } from "@/store/auth";
import { useUserStore } from "@/store/user";
import { Calendar2, Edit } from "iconsax-reactjs";
import { useEffect, useState } from "react";

export const ProfilePage = () => {
    const { user, setUser } = useUserStore();
    const { token } = useAuthStore();

    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [weight, setWeight] = useState<number>(0);
    const [height, setHeight] = useState<number>(0);
    const [age, setAge] = useState<number>(0);
    const [open, setopen] = useState(false);
    const [error, seterror] = useState("");
    const [updatingProfile, setupdatingProfile] = useState(false);

    useEffect(() => {
        setFirstName(user?.firstName!);
        setLastName(user?.lastName!);
        setWeight(user?.weight!);
        setHeight(user?.height!);
        setAge(user?.age!);
    }, [open, user]);

    const handleUpdateUser = async () => {
        if (!token) return;

        try {
            setupdatingProfile(true);
            const response = await updateUser(user?.id!, token, {
                firstName,
                lastName,
                email: user?.email!,
                age,
                gender: user?.gender!,
                height,
                weight,
            });

            if (response.status === 200) {
                const response = await getMe(token, user?.tenantId!);
                setUser(response.data);
                setopen(false)
            }
        } catch (error: any) {
            const msg = error.response.data.message;

            if (Array.isArray(msg)) {
                seterror(msg[0]);
            } else {
                seterror(msg);
            }
        } finally {
            setupdatingProfile(false);
        }
    };

    return (
        <div className="mt-10">
            <div className="relative w-full h-30 bg-foreground border-2 border-foreground rounded-3xl">
                <GridPattern
                    width={25}
                    height={25}
                    strokeDasharray="2 6"
                    className={cn(
                        "inset-0 z-0 pointer-events-none",
                        "mask-[radial-gradient(1000px_circle_at_center,white,transparent)]"
                    )}
                />
                {user && (
                    <Avatar
                        firstName={user?.firstName}
                        lastName={user?.lastName}
                        size={90}
                        className="text-3xl border-2 border-white left-5 md:left-10 absolute -bottom-10 shadow-sm"
                    />
                )}
            </div>

            <Dialog
                open={open}
                onOpenChange={(open) => {
                    setopen(open);
                    setFirstName("");
                    setLastName("");
                    setWeight(0);
                    setHeight(0);
                    setAge(0);
                    seterror("");
                }}
            >
                <div className="mt-13 ml-6 md:ml-12">
                    <h1 className="text-3xl font-bold md:text-4xl ">
                        {user?.firstName} {user?.lastName}
                        <DialogTrigger asChild>
                            <Button
                                animate={true}
                                className="ml-3 p-2"
                                variant="outline"
                            >
                                <Edit
                                    variant="Bold"
                                    size={18}
                                    color="#292929"
                                />
                            </Button>
                        </DialogTrigger>
                    </h1>
                    <h3 className="flex items-center text-muted-foreground gap-x-1 mt-2">
                        <Calendar2 variant="Bulk" size={18} color="#0000008A" />{" "}
                        Start date: {formatDate(user?.createdAt!)}
                    </h3>
                </div>

                <DialogContent>
                    <DialogTitle>Update Profile</DialogTitle>
                    <DialogDescription>
                        Fill the required fields to update your profile
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
                    </div>

                    <DialogFooter>
                        <Button onClick={handleUpdateUser} className="self-end">
                            {updatingProfile ? (
                                <Spinner color="#fff" className="size-6" />
                            ) : (
                                <>Save</>
                            )}
                        </Button>
                    </DialogFooter>

                    {error !== "" && (
                        <div className="text-red-500 mt-2 text-sm">
                            {error.charAt(0).toUpperCase() + error.slice(1)}
                        </div>
                    )}
                </DialogContent>
            </Dialog>
        </div>
    );
};
