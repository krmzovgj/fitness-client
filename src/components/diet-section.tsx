import { createDiet, getDietByClient } from "@/api/diet";
import {
    Empty,
    EmptyDescription,
    EmptyHeader,
    EmptyMedia,
    EmptyTitle,
} from "@/components/ui/empty";
import { dayColors, dayOrder } from "@/lib/utils";
import { Day } from "@/model/day";
import type { Diet } from "@/model/diet";
import { UserRole, type User } from "@/model/user";
import type { Workout } from "@/model/workout";
import { useAuthStore } from "@/store/auth";
import { useUserStore } from "@/store/user";
import { Book } from "iconsax-reactjs";
import { useEffect, useState } from "react";
import { dietColumns } from "./columns/diet-columnst";
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
import { Input } from "./ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "./ui/select";
import { Spinner } from "./ui/spinner";

export const DietSection = ({ client }: { client: User }) => {
    const { token } = useAuthStore();
    const { user } = useUserStore();
    const [mealDays, setmealDays] = useState<Diet[]>([]);

    const [name, setname] = useState("");
    const [day, setday] = useState<Day>(Day.MONDAY);
    const [error, seterror] = useState("");
    const [creatingDiet, setcreatingDiet] = useState(false);
    const [dialogOpen, setdialogOpen] = useState(false);
    const [selectedDiet, setselectedDiet] = useState<Workout | null>(null);

    const sortedMealDays = mealDays.sort((a, b) => {
        return dayOrder.indexOf(a.day) - dayOrder.indexOf(b.day);
    });

    const handleGetDietsByClient = async () => {
        if (!token || !client.id) return;
        try {
            const response = await getDietByClient(client.id, token);
            setmealDays(response.data);
        } catch (error) {}
    };

    useEffect(() => {
        handleGetDietsByClient();
    }, [token, client]);

    useEffect(() => {
        if (!selectedDiet) return;

        setname(selectedDiet.name);
        setday(selectedDiet.day);
    }, [selectedDiet]);

    const handleCreateDiet = async () => {
        if (!token) return;
        try {
            setcreatingDiet(true);
            const response = await createDiet(token, {
                name,
                day,
                clientId: client.id,
            });
            if (response.status === 201) {
                setdialogOpen(false);
                handleGetDietsByClient();
                setname("");
                setday(Day.MONDAY);
            }
        } catch (error: any) {
            const msg = error.response.data.message;

            if (Array.isArray(msg)) {
                seterror(msg[0]);
            } else {
                seterror(msg);
            }
        } finally {
            setcreatingDiet(false);
        }
    };

    // const handleUpdateDiet = async () => {
    //     if (!token || !selectedDiet) return;

    //     const payload = {
    //         ...selectedDiet,
    //         name,
    //         day,
    //     };

    //     try {
    //         setcreatingDiet(true);
    //         // const response = await updateWorkout(
    //         //     selectedDiet?.id,
    //         //     token,
    //         //     payload
    //         // );

    //         // if (response.status === 200) {
    //         //     setdialogOpen(false);
    //         //     handleGetDietsByClient();
    //         //     setselectedDiet(null), setname("");
    //         //     setday(Day.MONDAY);
    //         // }
    //     } catch (error: any) {
    //         const msg = error.response.data.message;

    //         if (Array.isArray(msg)) {
    //             seterror(msg[0]);
    //         } else {
    //             seterror(msg);
    //         }
    //     } finally {
    //         setcreatingDiet(false);
    //     }
    // };

    return (
        <Dialog open={dialogOpen} onOpenChange={setdialogOpen}>
            <div className="mt-14">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-x-2">
                        <div className="w-1 h-5 bg-[#FF6B6B] rounded-full"></div>
                        <h1 className="text-xl md:text-2xl">
                            {client?.firstName}'s Diet Plan
                        </h1>
                    </div>
                    <DialogTrigger>
                        <Button variant="default">Add Diet</Button>
                    </DialogTrigger>
                </div>

                <div className="mt-5">
                    {mealDays.length === 0 ? (
                        <Empty>
                            <EmptyHeader>
                                <EmptyMedia variant="icon">
                                    <Book
                                        variant="Bold"
                                        size={20}
                                        color="#000"
                                    />
                                </EmptyMedia>
                                <EmptyTitle>No Diet Yet</EmptyTitle>
                                <EmptyDescription>
                                    {user?.role === UserRole.TRAINER
                                        ? "No diet created yet. Once you create a diet it will appear here"
                                        : "No diet yet. Once your trainer creates a diet it will appear here"}
                                </EmptyDescription>
                            </EmptyHeader>
                        </Empty>
                    ) : (
                        <DataTable
                            data={sortedMealDays}
                            columns={dietColumns()}
                        />
                    )}
                </div>
            </div>

            <DialogContent>
                <DialogTitle>
                    {selectedDiet ? "Update" : "Add"} New Diet
                </DialogTitle>
                <DialogDescription>
                    Fill the required fields to{" "}
                    {selectedDiet ? "update" : "add"} a new diet
                </DialogDescription>

                <Input
                    value={name}
                    onChange={(e) => setname(e.target.value)}
                    placeholder="Name e.g. Muscle Gain"
                />
                <Select
                    value={day}
                    onValueChange={(value: Day) => setday(value)}
                >
                    <SelectTrigger>
                        <SelectValue placeholder="Day" />
                    </SelectTrigger>
                    <SelectContent>
                        {dayColors.map((dayItem) => (
                            <SelectItem value={dayItem.day}>
                                <div className="flex items-center gap-x-2">
                                    <div
                                        className="w-2 h-2 rounded-full"
                                        style={{
                                            backgroundColor: dayItem.color,
                                        }}
                                    ></div>
                                    <h2>{dayItem.day}</h2>
                                </div>
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>

                {error !== "" && (
                    <div className="text-red-500 mt-2 text-sm">
                        {error.charAt(0).toUpperCase() + error.slice(1)}
                    </div>
                )}
                <DialogFooter onClick={handleCreateDiet}>
                    <Button className="self-end">
                        {creatingDiet ? (
                            <Spinner className="size-6" />
                        ) : (
                            <>{selectedDiet ? "Update" : "Add"} Diet</>
                        )}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};
