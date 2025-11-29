import {
    AlertDialog,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { dayColors } from "@/lib/utils";
import type { Exercise } from "@/model/exercise";
import { type ColumnDef } from "@tanstack/react-table";
import { Edit, Trash } from "iconsax-reactjs";

interface ExerciseColumnsProps {
    onEdit?: (exercise: Exercise) => void;
    onDelete?: (exercise: Exercise) => void;
}

export const getExerciseColumns = ({
    onEdit,
    onDelete,
}: ExerciseColumnsProps): ColumnDef<Exercise>[] => [
    {
        accessorKey: "day",
        header: "Day",
        cell: ({ row }) => {
            const dayValue = row.original.day;
            const dayInfo = dayColors.find((d) => d.day === dayValue);

            return (
                <span className="whitespace-nowrap flex items-center gap-x-2">
                    <div
                        style={{ backgroundColor: dayInfo?.color }}
                        className="w-2 h-2 rounded-full"
                    />
                    {dayValue}
                </span>
            );
        },
    },
    {
        accessorKey: "name",
        header: "Exercise",
        cell: ({ row }) => (
            <span className="whitespace-nowrap">{row.original.name}</span>
        ),
    },
    {
        accessorKey: "sets",
        header: "Sets",
        cell: ({ row }) => (
            <span className="whitespace-nowrap">x{row.original.sets}</span>
        ),
    },
    {
        accessorKey: "reps",
        header: "Reps",
        cell: ({ row }) => (
            <span className="whitespace-nowrap">x{row.original.reps}</span>
        ),
    },
    {
        id: "actions",
        header: "",
        cell: ({ row }) => {
            const exercise = row.original;

            return (
                <span className="flex items-center gap-2 justify-start">
                    <Button
                        size="sm"
                        variant="outline"
                        onClick={() => onEdit!(exercise)}
                    >
                        <Edit variant="Bulk" size={20} color="#000" />
                    </Button>

                    <AlertDialog>
                        <AlertDialogTrigger asChild>
                            <Button size="sm" variant="outline">
                                <Trash variant="Bulk" size={20} color="red" />
                            </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                                <h3 className="text-lg font-bold">
                                    Delete Exercise?
                                </h3>
                                <p>
                                    Are you sure you want to delete{" "}
                                    {exercise.name}?
                                </p>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>

                                <Button
                                    onClick={() => onDelete!(exercise)}
                                    variant="destructive"
                                >
                                    Delete
                                </Button>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                </span>
            );
        },
    },
];
