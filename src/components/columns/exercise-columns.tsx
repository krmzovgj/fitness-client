"use client";

import { deleteWorkoutExercise } from "@/api/workout-exercise";
import { UserRole } from "@/model/user";
import type { WorkoutExercise } from "@/model/workout-exercise";
import { useAuthStore } from "@/store/auth";
import { useUserStore } from "@/store/user";
import type { ColumnDef } from "@tanstack/react-table";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowDown, Edit, Maximize4, Timer1, Trash } from "iconsax-reactjs";
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

/* ---------------- EXPORTED HELPERS (unchanged) ---------------- */

export let toggleEditOrders: (() => void) | null = null;
export let getAllOrderValues:
    | (() => { id: string; orderNumber: number }[])
    | null = null;

/* ---------------- ACTION CELL COMPONENT ---------------- */

function ActionsCell({
    row,
    onEdit,
    onDeleted,
}: {
    row: WorkoutExercise;
    onEdit: (ex: WorkoutExercise) => void;
    onDeleted: (id: string) => void;
}) {
    const { user } = useUserStore();
    const { token } = useAuthStore();
    const [openAlertDialog, setopenAlertDialog] = useState(false);
    const [deletingExercise, setDeletingExercise] = useState(false);

    if (user?.role === UserRole.CLIENT) return null;

    const handleDeleteExercise = async () => {
        try {
            setDeletingExercise(true);
            const response = await deleteWorkoutExercise(row.id, token!);
            if (response.status === 200) {
                onDeleted(row.id);
                setopenAlertDialog(false);
            }
        } finally {
            setDeletingExercise(false);
        }
    };

    return (
        <div className="flex items-center gap-x-2 whitespace-nowrap">
            <Button onClick={() => onEdit(row)} variant="outline">
                <Edit variant="Bold" size={18} color="#292929" />
                Edit
            </Button>

            <AlertDialog
                open={openAlertDialog}
                onOpenChange={setopenAlertDialog}
            >
                <AlertDialogTrigger asChild>
                    <Button variant="outline">
                        <Trash variant="Bold" size={18} color="red" />
                        Delete
                    </Button>
                </AlertDialogTrigger>

                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Delete exercise</AlertDialogTitle>
                        <AlertDialogDescription>
                            Are you sure you want to delete this exercise? This
                            action is irreversible.
                        </AlertDialogDescription>
                    </AlertDialogHeader>

                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <Button
                            className="w-full"
                            variant="destructive"
                            onClick={handleDeleteExercise}
                        >
                            {deletingExercise ? (
                                <Spinner color="#fff" className="size-6" />
                            ) : (
                                "Delete Exercise"
                            )}
                        </Button>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}

export const ExerciseColumns = (
    setSelectedExercise: (exercise: WorkoutExercise | null) => void,
    setopen: (open: boolean) => void,
    setworkoutExercises: React.Dispatch<
        React.SetStateAction<WorkoutExercise[]>
    >,
    editOrders: boolean,
    orderValues: Record<string, number>,
    setOrderValues: React.Dispatch<React.SetStateAction<Record<string, number>>>
): ColumnDef<WorkoutExercise>[] => [
    {
        accessorKey: "orderNumber",
        header: "Order",
        cell: ({ row }) => {
            const { user } = useUserStore();
            const rowId = row.original.id;

            if (!editOrders || user?.role === UserRole.CLIENT) {
                return (
                    <span className="text-muted-foreground">
                        {row.original.orderNumber}
                    </span>
                );
            }

            return (
                <AnimatePresence>
                    <motion.div
                        initial={{
                            opacity: 0,
                            filter: "blur(20px)",
                        }}
                        animate={{
                            opacity: 1,
                            filter: "blur(0px)",
                        }}
                        transition={{ duration: 0.7, type: "spring" }}
                    >
                        <input
                            type="number"
                            min={0}
                            className="w-14 text-center rounded-md border relative no-arrows"
                            value={orderValues[rowId]}
                            onChange={(e) => {
                                const val = e.target.value;
                                setOrderValues((prev) => ({
                                    ...prev,
                                    [rowId]: val === "" ? 0 : Number(val),
                                }));
                            }}
                            onFocus={(e) => e.target.select()}
                        />
                    </motion.div>
                </AnimatePresence>
            );
        },
    },
    {
        accessorKey: "exercise.name",
        header: "Exercise",
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
            <>
                <span className="font-bold text-xs text-[#FF8C00]">x</span>
                {row.original.sets}
            </>
        ),
    },
    {
        accessorKey: "exercise.reps",
        header: "Reps",
        cell: ({ row }) => (
            <>
                <span className="font-bold text-xs text-[#FF8C00]">x</span>
                {row.original.reps}
            </>
        ),
    },

    {
        accessorKey: "weight",
        header: "Target Weight",
        cell: ({ row }) => (
            <>
                {row.original.weight ? (
                    <div className="">
                        {row.original.weight}
                        <span className="font-bold text-xs text-muted-foreground">
                            kg
                        </span>
                    </div>
                ) : (
                    "N/A"
                )}
            </>
        ),
    },
    {
        accessorKey: "exercise.note",
        header: "Note",
        cell: ({ row }) =>
            row.original.note ? (
                <Dialog>
                    <DialogTrigger className="flex items-center whitespace-nowrap gap-x-1 cursor-pointer">
                        {row.original.note.slice(0, 15)}...
                        <Maximize4 variant="Bold" size={15} />
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle className="text-left">
                                Note for {row.original.exercise.name}
                            </DialogTitle>
                        </DialogHeader>
                        <DialogDescription>
                            {row.original.note}
                        </DialogDescription>
                    </DialogContent>
                </Dialog>
            ) : (
                "N/A"
            ),
    },
    {
        accessorKey: "restBetweenSets",
        header: "Rest BTWS",
        cell: ({ row }) => (
            <>
                {row.original.restBetweenSets ? (
                    <div className="whitespace-nowrap flex items-center gap-x-1">
                        {row.original.restBetweenSets}
                        <Timer1 variant="Bold" size={15} />
                    </div>
                ) : (
                    "N/A"
                )}
            </>
        ),
    },

    {
        accessorKey: "restAfterExercise",
        header: "Rest AFE",
        cell: ({ row }) => (
            <>
                {row.original.restAfterExercise ? (
                    <div className="whitespace-nowrap flex items-center gap-x-1">
                        {row.original.restAfterExercise}
                        <ArrowDown variant="Bold" size={15} />
                    </div>
                ) : (
                    "N/A"
                )}
            </>
        ),
    },
    {
        id: "actions",
        header: "",
        cell: ({ row }) => (
            <ActionsCell
                row={row.original}
                onEdit={(ex) => {
                    setopen(true);
                    setSelectedExercise(ex);
                }}
                onDeleted={(id) =>
                    setworkoutExercises((prev) =>
                        prev.filter((ex) => ex.id !== id)
                    )
                }
            />
        ),
    },
];
