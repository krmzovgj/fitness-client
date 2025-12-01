import {
    createWorkout,
    getWorkoutsByClient,
    updateWorkout,
} from "@/api/workout";
import {
    Empty,
    EmptyDescription,
    EmptyHeader,
    EmptyMedia,
    EmptyTitle,
} from "@/components/ui/empty";
import { dayColors, dayOrder } from "@/lib/utils";
import { Day } from "@/model/day";
import { UserRole, type User } from "@/model/user";
import type { Workout } from "@/model/workout";
import { useAuthStore } from "@/store/auth";
import { useUserStore } from "@/store/user";
import { Box1 } from "iconsax-reactjs";
import { useEffect, useState } from "react";
import { workoutColumns } from "./columns/workout-columns";
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

export const WorkoutSection = ({ client }: { client: User }) => {
    const { token } = useAuthStore();
    const { user } = useUserStore();
    const [workouts, setworkouts] = useState<Workout[]>([]);

    const [name, setname] = useState("");
    const [day, setday] = useState<Day>(Day.MONDAY);
    const [error, seterror] = useState("");
    const [creatingWorkout, setcreatingWorkout] = useState(false);
    const [dialogOpen, setdialogOpen] = useState(false);
    const [selectedWorkout, setselectedWorkout] = useState<Workout | null>(
        null
    );

    const sortedWorkouts = workouts.sort((a, b) => {
        return dayOrder.indexOf(a.day) - dayOrder.indexOf(b.day);
    });

    const handleGetWorkoutsByClient = async () => {
        if (!token || !client.id) return;
        try {
            const response = await getWorkoutsByClient(token, client.id);
            setworkouts(response.data);
        } catch (error) {}
    };

    useEffect(() => {
        handleGetWorkoutsByClient();
    }, [token, client]);

    useEffect(() => {
        if (!selectedWorkout) return;

        setname(selectedWorkout.name);
        setday(selectedWorkout.day);
    }, [selectedWorkout]);

    const handleCreateWorkout = async () => {
        if (!token) return;
        try {
            setcreatingWorkout(true);
            const response = await createWorkout(token, {
                name,
                day,
                clientId: client.id,
            });
            if (response.status === 201) {
                setdialogOpen(false);
                handleGetWorkoutsByClient();
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
            setcreatingWorkout(false);
        }
    };

    const handleUpdateWorkout = async () => {
        if (!token || !selectedWorkout) return;

        const payload = {
            ...selectedWorkout,
            name,
            day,
        };

        try {
            setcreatingWorkout(true);
            const response = await updateWorkout(
                selectedWorkout?.id,
                token,
                payload
            );

            if (response.status === 200) {
                setdialogOpen(false);
                handleGetWorkoutsByClient();
                setselectedWorkout(null), setname("");
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
            setcreatingWorkout(false);
        }
    };

    return (
        <Dialog open={dialogOpen} onOpenChange={setdialogOpen}>
            <div className="mt-14">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-x-2">
                        <div className="w-1 h-5 bg-[#66A786] rounded-full"></div>
                        <h1 className="text-xl md:text-2xl">
                            {client?.firstName}'s Workout Plan
                        </h1>
                    </div>
                    <DialogTrigger>
                        <Button variant="default">Add Workout</Button>
                    </DialogTrigger>
                </div>

                <div className="mt-5">
                    {workouts.length === 0 ? (
                        <Empty>
                            <EmptyHeader>
                                <EmptyMedia variant="icon">
                                    <Box1
                                        variant="Bold"
                                        size={20}
                                        color="#000"
                                    />
                                </EmptyMedia>
                                <EmptyTitle>No Workouts Yet</EmptyTitle>
                                <EmptyDescription>
                                    {user?.role === UserRole.TRAINER
                                        ? "No workouts created yet. Once you create a workout it will appear here"
                                        : "No workouts yet. Once your trainer creates a workout it will appear here"}
                                </EmptyDescription>
                            </EmptyHeader>
                        </Empty>
                    ) : (
                        <DataTable
                            data={sortedWorkouts}
                            columns={workoutColumns(
                                setselectedWorkout,
                                setdialogOpen
                            )}
                        />
                    )}
                </div>
            </div>

            <DialogContent>
                <DialogTitle>
                    {selectedWorkout ? "Update" : "Add"} New Workout
                </DialogTitle>
                <DialogDescription>
                    Fill the required fields to{" "}
                    {selectedWorkout ? "update" : "add"} a new workout
                </DialogDescription>

                <Input
                    value={name}
                    onChange={(e) => setname(e.target.value)}
                    placeholder="Name e.g. Upper Body"
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
                <DialogFooter
                    onClick={
                        selectedWorkout
                            ? handleUpdateWorkout
                            : handleCreateWorkout
                    }
                >
                    <Button className="self-end">
                        {creatingWorkout ? (
                            <Spinner className="size-6" />
                        ) : (
                            <>{selectedWorkout ? "Update" : "Add"} Workout</>
                        )}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};
