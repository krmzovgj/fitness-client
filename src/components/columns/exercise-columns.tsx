"use client";

import { deleteExercise } from "@/api/exercise";
import { formatDate } from "@/lib/utils";
import { UserRole } from "@/model/user";
import type { WorkoutExercise } from "@/model/workout-exercise";
import { useAuthStore } from "@/store/auth";
import { useUserStore } from "@/store/user";
import type { ColumnDef } from "@tanstack/react-table";
import { Edit, Maximize4, Trash } from "iconsax-reactjs";
import { useState } from "react";
import {
    AlertDialog,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "../ui/alert-dialog";
import { Button } from "../ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTrigger,
} from "../ui/dialog";
import { Spinner } from "../ui/spinner";

export const ExerciseColumns = (
    setSelectedExercise: (exercise: WorkoutExercise | null) => void,
    setopen: (open: boolean) => void,
    handleGetExercisesByWorkout: () => void
): ColumnDef<WorkoutExercise>[] => [
    {
        accessorKey: "name",
        header: "Name",
        cell: ({ row }) => (
            <span className="whitespace-nowrap">
                {row.original.exercise.name}
            </span>
        ),
    },
    {
        accessorKey: "sets",
        header: "Sets",
        cell: ({ row }) => (
            <span className="whitespace-nowrap">
                {row.original.sets}
                <span className="font-bold text-xs text-[#FF8C00]">x</span>
            </span>
        ),
    },
    {
        accessorKey: "reps",
        header: "Reps",
        cell: ({ row }) => (
            <span className="whitespace-nowrap">
                {row.original.reps}
                <span className="font-bold text-xs text-[#FF8C00]">x</span>
            </span>
        ),
    },
    {
        accessorKey: "note",
        header: "Note",
        cell: ({ row }) => {
            return (
                <Dialog>
                    <span className="whitespace-nowrap">
                        {row.original.note ? (
                            <DialogTrigger className="flex items-center gap-x-1 cursor-pointer">
                                {row.original.note.slice(0, 15) + "..."}
                                {row.original.note ? (
                                    <Maximize4
                                        variant="Bold"
                                        size={15}
                                        color="#000"
                                    />
                                ) : null}
                            </DialogTrigger>
                        ) : (
                            "N/A"
                        )}
                    </span>

                    <DialogContent>
                        <DialogHeader>
                            <div className="flex items-center gap-x-2">
                                Note for {row.original.exercise.name}
                            </div>
                        </DialogHeader>
                        <DialogDescription>
                            {row.original.note}
                        </DialogDescription>
                    </DialogContent>
                </Dialog>
            );
        },
    },
    {
        accessorKey: "updatedAt",
        header: "Updated At",
        cell: ({ row }) => {
            return (
                <span className="whitespace-nowrap">
                    {formatDate(row.original.updatedAt)}
                </span>
            );
        },
    },
    {
        id: "actions",
        header: "",
        cell: ({ row }) => {
            const { user } = useUserStore();
            const { token } = useAuthStore();
            const [openAlertDialog, setopenAlertDialog] = useState(false);
            const [deletingExercise, setDeletingExercise] = useState(false);

            if (user?.role === UserRole.CLIENT) return null;

            const handleOpenEdit = () => {
                setopen(true);
                setSelectedExercise(row.original);
            };

            const handleDeleteExercise = async () => {
                try {
                    setDeletingExercise(true);

                    const response = await deleteExercise(
                        row.original.id,
                        token!
                    );
                    if (response.status === 200) {
                        handleGetExercisesByWorkout();
                        setopenAlertDialog(false);
                    }
                } catch (error) {
                } finally {
                    setDeletingExercise(false);
                }
            };

            return (
                <div className="flex items-center gap-x-2 whitespace-nowrap">
                    {user?.role === UserRole.TRAINER && (
                        <div className="flex items-center gap-x-2">
                            <Button onClick={handleOpenEdit} variant="outline">
                                <Edit
                                    variant="Bold"
                                    size={18}
                                    color="#292929"
                                />
                                Edit
                            </Button>

                            <AlertDialog
                                open={openAlertDialog}
                                onOpenChange={setopenAlertDialog}
                            >
                                <AlertDialogTrigger asChild>
                                    <Button variant="outline">
                                        <Trash
                                            variant="Bold"
                                            size={18}
                                            color="red"
                                        />
                                        Delete
                                    </Button>
                                </AlertDialogTrigger>

                                <AlertDialogContent>
                                    <AlertDialogHeader>
                                        <AlertDialogTitle>
                                            Delete exercise
                                        </AlertDialogTitle>
                                        <AlertDialogDescription>
                                            Are you sure you want to delete this
                                            exercise? This action is
                                            irreversible.
                                        </AlertDialogDescription>
                                    </AlertDialogHeader>

                                    <AlertDialogFooter>
                                        <AlertDialogCancel>
                                            Cancel
                                        </AlertDialogCancel>
                                        <Button
                                            variant="destructive"
                                            onClick={handleDeleteExercise}
                                        >
                                            {deletingExercise ? (
                                                <Spinner className="size-6" />
                                            ) : (
                                                <h3>Delete Exercise</h3>
                                            )}
                                        </Button>
                                    </AlertDialogFooter>
                                </AlertDialogContent>
                            </AlertDialog>
                        </div>
                    )}
                </div>
            );
        },
    },
];
