"use client";

import { deleteExercise, updateExercise } from "@/api/exercise";
import { formatDate } from "@/lib/utils";
import type { Exercise } from "@/model/exercise";
import { UserRole } from "@/model/user";
import { useAuthStore } from "@/store/auth";
import { useUserStore } from "@/store/user";
import type { ColumnDef } from "@tanstack/react-table";
import { CloseCircle, Edit, TickCircle, Trash } from "iconsax-reactjs";
import { useEffect, useState } from "react";
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
import { Input } from "../ui/input";
import { Spinner } from "../ui/spinner";

export const ExerciseColumns = (
    setSelectedExercise: (exercise: Exercise | null) => void,
    setopen: (open: boolean) => void,
    handleGetExercisesByWorkout: () => void
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
                <span className="font-bold text-xs text-[#66A786]">x</span>
            </span>
        ),
    },
    {
        accessorKey: "reps",
        header: "Reps",
        cell: ({ row }) => (
            <span className="whitespace-nowrap">
                {row.original.reps}
                <span className="font-bold text-xs text-[#66A786]">x</span>
            </span>
        ),
    },

    {
        accessorKey: "actualPerformance",
        header: "Actual Performance",
        cell: ({ row }) => {
            const [editingPerformanceId, setEditingPerformanceId] = useState<
                string | null
            >(null);
            const [actualPerformance, setActualPerformance] = useState("");

            const match = editingPerformanceId === row.original.id;
            const { token } = useAuthStore();

            const handleSaveActualPerformance = async () => {
                if (!token) return;

                const payload = {
                    name: row.original.name,
                    sets: row.original.sets,
                    reps: row.original.reps,
                    actualPerformance,
                };

                try {
                    const response = await updateExercise(
                        row.original.id,
                        payload,
                        token
                    );

                    if (response.status === 200) {
                        setEditingPerformanceId(null);
                        handleGetExercisesByWorkout();
                    }
                } catch (err) {
                    console.log(err);
                }
            };

            useEffect(() => {
                if (editingPerformanceId) {
                    setActualPerformance(row.original.actualPerformance || "");
                }
            }, [editingPerformanceId, row.original.actualPerformance]);

            return (
                <div>
                    {match ? (
                        <div className="flex items-center gap-x-3">
                            <Input
                                maxLength={25}
                                autoFocus={true}
                                value={actualPerformance}
                                onChange={(e) =>
                                    setActualPerformance(e.target.value)
                                }
                                onKeyDown={(e) => {
                                    if (e.key === "Enter") {
                                        handleSaveActualPerformance();
                                    }
                                    if (e.key === "Escape") {
                                        setEditingPerformanceId(null);
                                    }
                                }}
                                className="w-44"
                                placeholder="e.g. 70kg x 10"
                            />
                            <div className="flex items-centerg gap-x-2">
                                <TickCircle
                                    onClick={handleSaveActualPerformance}
                                    className="cursor-pointer"
                                    variant="Bold"
                                    size={26}
                                    color="#000"
                                />
                                <CloseCircle
                                    onClick={() =>
                                        setEditingPerformanceId(null)
                                    }
                                    className="cursor-pointer"
                                    variant="Bulk"
                                    size={26}
                                    color="red"
                                />
                            </div>
                        </div>
                    ) : (
                        <div
                            className="border border-dashed border-foreground/30 h-10 flex items-center w-fit px-10 rounded-2xl cursor-pointer"
                            onClick={() =>
                                setEditingPerformanceId(row.original.id)
                            }
                        >
                            {row.original.actualPerformance ? (
                                <span className="whitespace-nowrap">
                                    {row.original.actualPerformance}
                                </span>
                            ) : (
                                <span className="whitespace-nowrap text-foreground/70 flex items-center gap-x-2">
                                    N/A
                                    <Edit
                                        variant="Bulk"
                                        size={18}
                                        color="#000"
                                    />
                                </span>
                            )}
                        </div>
                    )}
                </div>
            );
        },
    },

    {
        accessorKey: "createdAt",
        header: "Created At",
        cell: ({ row }) => {
            return (
                <span className="whitespace-nowrap">
                    {formatDate(row.original.createdAt)}
                </span>
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
                <div className="whitespace-nowrap">
                    {user?.role === UserRole.TRAINER && (
                        <div className="flex items-center gap-x-2">
                            <Button onClick={handleOpenEdit} variant="outline">
                                <Edit
                                    variant="Bulk"
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
                                            variant="Bulk"
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
                                            meal? This action is irreversible.
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
