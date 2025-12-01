"use client";

import { dayColors } from "@/lib/utils";
import { UserRole } from "@/model/user";
import type { Workout } from "@/model/workout";
import { useUserStore } from "@/store/user";
import type { ColumnDef } from "@tanstack/react-table";
import { Edit, ExportSquare } from "iconsax-reactjs";
import { useNavigate } from "react-router-dom";
import { Button } from "../ui/button";

export const workoutColumns = (
    setSelectedWorkout: (workout: Workout) => void,
    setopen: (open: boolean) => void
): ColumnDef<Workout>[] => [
    {
        accessorKey: "day",
        header: "Day",
        cell: ({ row }) => {
            const matched = dayColors.find(
                (day) => day.day === row.original.day
            );
            if (!matched) {
                return;
            }

            return (
                <span className="flex items-center gap-x-2">
                    <div
                        className="w-2 h-2 rounded-full"
                        style={{ backgroundColor: matched.color }}
                    ></div>
                    <h2 className="">{matched.day}</h2>
                </span>
            );
        },
    },
    {
        accessorKey: "name",
        header: "Name",
        cell: ({ row }) => (
            <span className="whitespace-nowrap">{row.original.name}</span>
        ),
    },
    {
        id: "actions",
        header: "",
        cell: ({ row }) => {
            const { user } = useUserStore();
            if (user?.role === UserRole.CLIENT) return null;

            const handleOpenEdit = () => {
                setopen(true);
                setSelectedWorkout(row.original);
            };

            return (
                <div>
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
                        </div>
                    )}
                </div>
            );
        },
    },
    {
        id: "open",
        header: "",
        cell: ({ row }) => {
            const navigate = useNavigate();
            return (
                <div
                    onClick={() =>
                        navigate(`/client/${row.original.id}/exercises`, {
                            state: {
                                name: row.original.name,
                                day: row.original.day,
                            },
                        })
                    }
                    className="flex hover:underline cursor-pointer gap-x-1 items-center"
                >
                    <h2>Open</h2>
                    <ExportSquare variant="Bold" size={14} color="#000" />
                </div>
            );
        },
    },
];
