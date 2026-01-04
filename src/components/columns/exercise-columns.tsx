"use client";

import { deleteWorkoutExercise } from "@/api/workout-exercise";
import { secondsToTime } from "@/lib/utils";
import { UserRole } from "@/model/user";
import type { WorkoutExercise } from "@/model/workout-exercise";
import { useAuthStore } from "@/store/auth";
import { useUserStore } from "@/store/user";
import type { ColumnDef } from "@tanstack/react-table";
import { ArrowForward, Edit, Maximize4, Timer1, Trash } from "iconsax-reactjs";
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
    DialogTitle,
    DialogTrigger,
} from "../ui/dialog";
import { Spinner } from "../ui/spinner";

export let toggleEditOrders: (() => void) | null = null;
export let getAllOrderValues:
    | (() => { id: string; orderNumber: number }[])
    | null = null;

export const ExerciseColumns = (
    setSelectedExercise: (exercise: WorkoutExercise | null) => void,
    setopen: (open: boolean) => void,
    handleGetExercisesByWorkout: () => void
): ColumnDef<WorkoutExercise>[] => {
    const [editOrders, setEditOrders] = useState(false);
    const [orderValues, setOrderValues] = useState<Record<string, number>>({});

    toggleEditOrders = () => {
        setEditOrders((prev) => !prev);

        if (!editOrders) {
            setOrderValues(() => ({}));
        }
    };

    getAllOrderValues = () =>
        Object.entries(orderValues).map(([id, orderNumber]) => ({
            id,
            orderNumber,
        }));

    return [
        {
            accessorKey: "orderNumber",
            header: "Order",
            cell: ({ row }) => {
                const { user } = useUserStore();
                const rowId = row.original.id;

                if (!editOrders || user?.role === UserRole.CLIENT) {
                    return <span>{row.original.orderNumber}</span>;
                }

                return (
                    <input
                        type="number"
                        min={0}
                        className="w-14 text-center rounded-md border relative no-arrows"
                        value={orderValues[rowId] ?? row.original.orderNumber}
                        onChange={(e) => {
                            const val = e.target.value;
                            setOrderValues((prev) => ({
                                ...prev,
                                [rowId]: val === "" ? 0 : Number(val),
                            }));
                        }}
                        onFocus={(e) => e.target.select()}
                    />
                );
            },
        },
        {
            accessorKey: "exercise.name",
            header: "Name",
            cell: ({ row }) => (
                <span className="whitespace-nowrap">
                    {row.original.exercise.name}
                </span>
            ),
        },
        {
            accessorKey: "exercise.sets",
            header: "Sets",
            cell: ({ row }) => (
                <span className="whitespace-nowrap">
                    <span className="font-bold text-xs text-[#FF8C00]">x</span>
                    {row.original.sets}
                </span>
            ),
        },
        {
            accessorKey: "exercise.reps",
            header: "Reps",
            cell: ({ row }) => (
                <span className="whitespace-nowrap">
                    <span className="font-bold text-xs text-[#FF8C00]">x</span>
                    {row.original.reps}
                </span>
            ),
        },
        {
            accessorKey: "exercise.note",
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
                                <DialogTitle>
                                    <div className="flex items-center gap-x-2">
                                        Note for {row.original.exercise.name}
                                    </div>
                                </DialogTitle>
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
            accessorKey: "exercise.restBetweenSets",
            header: "Rest Between Sets",
            cell: ({ row }) => {
                return (
                    <span className="whitespace-nowrap">
                        {row.original.restBetweenSets ? (
                            <span className="flex items-center gap-x-2">
                                {" "}
                                {secondsToTime(row.original.restBetweenSets!)}
                                <Timer1 variant="Bold" size={17} color="#000" />
                            </span>
                        ) : (
                            "N/A"
                        )}
                    </span>
                );
            },
        },

        {
            accessorKey: "exercise.restAfterExercise",
            header: "Rest After Exercise",
            cell: ({ row }) => {
                return (
                    <span className="whitespace-nowrap">
                        {row.original.restAfterExercise ? (
                            <span className="flex items-center gap-x-2">
                                {" "}
                                {secondsToTime(row.original.restAfterExercise!)}
                                <ArrowForward
                                    className="rotate-180"
                                    variant="Bold"
                                    size={17}
                                    color="#000"
                                />
                            </span>
                        ) : (
                            "N/A"
                        )}
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

                        const response = await deleteWorkoutExercise(
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
                                <Button
                                    onClick={handleOpenEdit}
                                    variant="outline"
                                >
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
                                                Are you sure you want to delete
                                                this exercise? This action is
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
                                                    <Spinner
                                                        color="#fff"
                                                        className="size-6"
                                                    />
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
};
