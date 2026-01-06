"use client";

import { deleteMeal } from "@/api/meal";
import { formatDate, mealTypes } from "@/lib/utils";
import type { Meal } from "@/model/meal";
import { UserRole } from "@/model/user";
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
    DialogTitle,
    DialogTrigger,
} from "../ui/dialog";
import { Spinner } from "../ui/spinner";

export const MealColumns = (
    setSelectedMeal: (meal: Meal | null) => void,
    setopen: (open: boolean) => void,
    setmeals: React.Dispatch<React.SetStateAction<Meal[]>>
): ColumnDef<Meal>[] => [
    {
        accessorKey: "name",
        header: "Name",
        cell: ({ row }) => (
            <span className="whitespace-nowrap">{row.original.name}</span>
        ),
    },
    {
        accessorKey: "description",
        header: "Recepie",
        cell: ({ row }) => {
            const match = mealTypes.find(
                (type) => type.type === row.original.type
            );

            return (
                <Dialog>
                    <span className="whitespace-nowrap">
                        <div>
                            {row.original.description ? (
                                <DialogTrigger className="flex items-center gap-x-1 cursor-pointer">
                                    {row.original.description.slice(0, 15) +
                                        "..."}
                                    {row.original.description ? (
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
                        </div>
                    </span>

                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>
                                <div className="flex items-center gap-x-2">
                                    {row.original.name}
                                    <span
                                        className="font-semibold"
                                        style={{ color: match?.color }}
                                    >
                                        {row.original.type}
                                    </span>
                                </div>
                            </DialogTitle>
                        </DialogHeader>
                        <DialogDescription>
                            {row.original.description}
                        </DialogDescription>

                        <div className="md:flex grid grid-cols-2 grid-rows-2 gap-2 md:grid-cols-4 md:grid-rows-1">
                            <div className="text-sm flex items-center">
                                Calories: {row.original.cal}
                                <span className="font-semibold text-sm text-muted-foreground">
                                    kcal
                                </span>
                            </div>

                            <div className="text-sm flex items-center">
                                Protein: {row.original.protein}
                                <span className="font-semibold text-sm text-muted-foreground">
                                    g
                                </span>
                            </div>

                            <div className="text-sm flex items-center">
                                Carbs: {row.original.carbs}
                                <span className="font-semibold text-sm text-muted-foreground">
                                    g
                                </span>
                            </div>

                            <div className="text-sm flex items-center">
                                Fats: {row.original.fats}
                                <span className="font-semibold text-sm text-muted-foreground">
                                    g
                                </span>
                            </div>
                        </div>
                    </DialogContent>
                </Dialog>
            );
        },
    },
    {
        accessorKey: "cal",
        header: "Calories",
        cell: ({ row }) => (
            <span className="whitespace-nowrap">
                {row.original.cal !== null && row.original.cal !== undefined ? (
                    <span>
                        {row.original.cal}
                        <span className="font-bold text-xs text-muted-foreground">
                            kcal
                        </span>
                    </span>
                ) : (
                    <span>N/A</span>
                )}
            </span>
        ),
    },
    {
        accessorKey: "protein",
        header: "Protein",
        cell: ({ row }) => (
            <span className="whitespace-nowrap">
                {row.original.protein !== null &&
                row.original.protein !== undefined ? (
                    <span>
                        {row.original.protein}
                        <span className="font-bold text-xs text-muted-foreground">
                            g
                        </span>
                    </span>
                ) : (
                    <span>N/A</span>
                )}
            </span>
        ),
    },

    {
        accessorKey: "carbs",
        header: "Carbs",
        cell: ({ row }) => (
            <span className="whitespace-nowrap">
                {row.original.carbs !== null &&
                row.original.carbs !== undefined ? (
                    <span>
                        {row.original.carbs}
                        <span className="font-bold text-xs text-muted-foreground">
                            g
                        </span>
                    </span>
                ) : (
                    <span>N/A</span>
                )}
            </span>
        ),
    },

    {
        accessorKey: "fats",
        header: "Fats",
        cell: ({ row }) => (
            <span className="whitespace-nowrap">
                {row.original.fats !== null &&
                row.original.fats !== undefined ? (
                    <span>
                        {row.original.fats}
                        <span className="font-bold text-xs text-muted-foreground">
                            g
                        </span>
                    </span>
                ) : (
                    <span>N/A</span>
                )}
            </span>
        ),
    },
    {
        accessorKey: "type",
        header: "Meal Type",
        cell: ({ row }) => {
            const match = mealTypes.find(
                (type) => type.type === row.original.type
            );
            return (
                <span
                    className="whitespace-nowrap"
                    style={{ color: match?.color }}
                >
                    {row.original.type}
                </span>
            );
        },
    },
    {
        accessorKey: "updatedAt",
        header: "Updated At",
        cell: ({ row }) => (
            <span className="whitespace-nowrap">
                {formatDate(row.original.updatedAt)}
            </span>
        ),
    },
    {
        id: "actions",
        header: "",
        cell: ({ row }) => {
            const { user } = useUserStore();
            const { token } = useAuthStore();
            const [openAlertDialog, setOpenAlertDialog] = useState(false);
            const [deletingMeal, setDeletingMeal] = useState(false);

            if (user?.role === UserRole.CLIENT) return null;

            const handleOpenEdit = () => {
                setopen(true);
                setSelectedMeal(row.original);
            };

            const handleDeleteMeal = async () => {
                try {
                    setDeletingMeal(true);

                    const response = await deleteMeal(row.original.id, token!);

                    if (response.status === 200) {
                        setOpenAlertDialog(false);
                        setmeals((prev) =>
                            prev.filter((meal) => meal.id !== row.original.id)
                        );
                    }
                } finally {
                    setDeletingMeal(false);
                }
            };

            return (
                <div className="whitespace-nowrap">
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
                                onOpenChange={setOpenAlertDialog}
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
                                            Delete meal
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
                                            className="w-full"
                                            variant="destructive"
                                            onClick={handleDeleteMeal}
                                        >
                                            {deletingMeal ? (
                                                <Spinner
                                                    color="#fff"
                                                    className="size-6"
                                                />
                                            ) : (
                                                "Delete Meal"
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
