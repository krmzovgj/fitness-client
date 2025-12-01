"use client";

import type { Exercise } from "@/model/exercise";
import { UserRole } from "@/model/user";
import { useUserStore } from "@/store/user";
import type { ColumnDef } from "@tanstack/react-table";
import { Edit, Trash } from "iconsax-reactjs";
import { Button } from "../ui/button";
import { formatDate } from "@/lib/utils";

export const ExerciseColumns = (
    setSelectedExercise?: (exercise: Exercise) => void,
    setopen?: (open: boolean) => void
): ColumnDef<Exercise>[] => [
    {
        accessorKey: "name",
        header: "Name",
        cell: ({ row }) => (
            <span className="whitespace-nowrap">{row.original.name}</span>
        ),
    },
    {
        accessorKey: "sets",
        header: "Sets",
        cell: ({ row }) => (
            <span className="whitespace-nowrap">
                {row.original.sets}
                <span className="font-bold text-xs text-foreground/60">x</span>
            </span>
        ),
    },
    {
        accessorKey: "reps",
        header: "Reps",
        cell: ({ row }) => (
            <span className="whitespace-nowrap">
                {row.original.reps}
                <span className="font-bold text-xs text-foreground/60">x</span>
            </span>
        ),
    },
    {
        accessorKey: "createdAt",
        header: "Created At",
        cell: ({ row }) => {
            return <span>{formatDate(row.original.createdAt)}</span>;
        },
    },

    {
        accessorKey: "updatedAt",
        header: "Updated At",
        cell: ({ row }) => {
            return <span>{formatDate(row.original.updatedAt)}</span>;
        },
    },
    {
        id: "actions",
        header: "",
        cell: ({ row }) => {
            const { user } = useUserStore();
            if (user?.role === UserRole.CLIENT) return null;

            return (
                <div className="whitespace-nowrap">
                    {user?.role === UserRole.TRAINER && (
                        <div className="flex items-center gap-x-2">
                            <Button variant="outline">
                                <Edit
                                    variant="Bulk"
                                    size={18}
                                    color="#292929"
                                />
                                Edit
                            </Button>

                            <Button variant="outline">
                                <Trash variant="Bulk" size={18} color="red" />
                                Delete
                            </Button>
                        </div>
                    )}
                </div>
            );
        },
    },
];
