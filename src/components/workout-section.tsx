import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { DataTable } from "@/components/client-table";
import { getExerciseColumns } from "@/components/exercise-column";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Spinner } from "@/components/ui/spinner";
import { dayColors, dayOrder } from "@/lib/utils";
import { Day, type Exercise } from "@/model/exercise";
import type { CreateExerciseDto, UpdateExerciseDto } from "@/api/exercise";
import {
    Empty,
    EmptyDescription,
    EmptyHeader,
    EmptyMedia,
    EmptyTitle,
} from "./ui/empty";
import { Weight } from "iconsax-reactjs";
import { UserRole } from "@/model/user";

type Props = {
    role: UserRole;
    workout: any;
    exercises: Exercise[];
    onCreate?: (exercise: CreateExerciseDto) => Promise<void>;
    onUpdate?: (id: string, exercise: UpdateExerciseDto) => Promise<void>;
    onDelete?: (exercise: Exercise) => Promise<void>;
};

export function WorkoutSection({
    role,
    workout,
    exercises,
    onCreate,
    onUpdate,
    onDelete,
}: Props) {
    const [openDialog, setOpenDialog] = useState(false);
    const [editing, setEditing] = useState<Exercise | null>(null);

    const [name, setName] = useState("");
    const [sets, setSets] = useState<number>(0);
    const [reps, setReps] = useState<number>(0);
    const [day, setDay] = useState<Day>(Day.MONDAY);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState("");

    const reset = () => {
        setEditing(null);
        setName("");
        setSets(0);
        setReps(0);
        setDay(Day.MONDAY);
        setError("");
    };

    const handleSubmit = async () => {
        setSubmitting(true);

        const createPayload = {
            name,
            sets,
            reps,
            day,
            workoutId: workout.id,
        };

        const updatePayload = {
            name,
            sets,
            reps,
            day,
        };

        try {
            if (editing) {
                await onUpdate!(editing.id, updatePayload);
            } else {
                await onCreate!(createPayload);
            }

            reset();
            setOpenDialog(false);
        } catch (err) {
            setError("Something went wrong");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="mt-14">
            <div className="flex justify-between items-center">
                <div className="flex items-center gap-x-2">
                    <div className="w-1 h-5 bg-[#66A786] rounded-full"></div>
                    <h1 className="text-2xl">{workout?.name}</h1>
                </div>

                <Dialog open={openDialog} onOpenChange={setOpenDialog}>
                    {role === UserRole.TRAINER && (
                        <DialogTrigger asChild>
                            <Button
                                onClick={() => {
                                    reset();
                                    setOpenDialog(true);
                                }}
                            >
                                Create Exercise
                            </Button>
                        </DialogTrigger>
                    )}

                    <DialogContent>
                        <DialogTitle>
                            {editing ? "Update Exercise" : "Create Exercise"}
                        </DialogTitle>
                        <DialogDescription>
                            Fill the required fields to{" "}
                            {editing ? "update" : "create an"} exercise
                        </DialogDescription>

                        <div className="grid gap-4 mt-4">
                            <Input
                                placeholder="Exercise Name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                            />
                            <Input
                                placeholder="Sets"
                                type="number"
                                value={sets === 0 ? "" : sets}
                                onChange={(e) =>
                                    setSets(Number(e.target.value))
                                }
                            />
                            <Input
                                placeholder="Reps"
                                type="number"
                                value={reps === 0 ? "" : reps}
                                onChange={(e) =>
                                    setReps(Number(e.target.value))
                                }
                            />

                            <Select
                                value={day}
                                onValueChange={(v) => setDay(v as Day)}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select Day" />
                                </SelectTrigger>
                                <SelectContent>
                                    {dayColors.map((d) => (
                                        <SelectItem key={d.day} value={d.day}>
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
                                <p className="text-red-500 text-sm">{error}</p>
                            )}
                        </div>

                        <DialogFooter className="mt-4">
                            <Button onClick={handleSubmit}>
                                {submitting ? (
                                    <Spinner />
                                ) : editing ? (
                                    "Update Exercise"
                                ) : (
                                    "Create Exercise"
                                )}
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>

            <div className="mt-4">
                {exercises.length === 0 ? (
                    <Empty>
                        <EmptyHeader>
                            <EmptyMedia variant="icon">
                                <Weight variant="Bold" size={20} color="#000" />
                            </EmptyMedia>
                            <EmptyTitle>No Exercises Yet</EmptyTitle>
                            <EmptyDescription>
                                {role === UserRole.TRAINER
                                    ? "You haven’t created any exercises yet. Get started by creating their first exercise."
                                    : "Your trainer hasn’t created any exercises yet. Once they create a plan, it will appear here."}
                            </EmptyDescription>
                        </EmptyHeader>
                    </Empty>
                ) : (
                    <DataTable
                        columns={getExerciseColumns({
                            onEdit: (exercise) => {
                                setEditing(exercise);
                                setName(exercise.name);
                                setSets(exercise.sets);
                                setReps(exercise.reps);
                                setDay(exercise.day);
                                setOpenDialog(true);
                            },
                            onDelete,
                        })}
                        data={exercises}
                    />
                )}
            </div>
        </div>
    );
}
