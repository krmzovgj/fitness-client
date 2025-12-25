"use client";

import { dayColors, formatDate } from "@/lib/utils";
import { UserRole } from "@/model/user";
import type { Workout } from "@/model/workout";
import { useUserStore } from "@/store/user";
import type { ColumnDef } from "@tanstack/react-table";
import { Calendar, Edit, Flash, Timer1 } from "iconsax-reactjs";
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

            const navigate = useNavigate();

            return (
                <span
                    onClick={() => {
                        if (row.original.restDay) return;

                        navigate(`/client/${row.original.id}/exercises`, {
                            state: {
                                name: row.original.name,
                                day: row.original.day,
                            },
                        });
                    }}
                    className=" cursor-pointer flex whitespace-nowrap items-center gap-x-2"
                >
                    <div className="relative  rounded-full">
                        <div
                            className="absolute w-2 h-2 bottom-0 right-0 rounded-full"
                            style={{ backgroundColor: matched.color }}
                        ></div>
                        <Calendar variant="Bulk" size={20} color={"#181818"} />
                    </div>
                    <h2 className="">{matched.day}</h2>
                </span>
            );
        },
    },
    {
        accessorKey: "name",
        header: "Name",
        cell: ({ row }) => {
            const navigate = useNavigate();

            return (
                <span
                    onClick={() => {
                        if (row.original.restDay) return;
                        navigate(`/client/${row.original.id}/exercises`, {
                            state: {
                                name: row.original.name,
                                day: row.original.day,
                            },
                        });
                    }}
                    className={`cursor-pointer whitespace-nowrap font-medium ${
                        row.original.restDay
                            ? "text-foreground/60"
                            : "text-foreground"
                    }`}
                >
                    {row.original.restDay
                        ? "N/A"
                        : row.original.name
                        ? row.original.name
                        : "N/A"}
                </span>
            );
        },
    },
    {
        accessorKey: "restDay",
        header: "Type",
        cell: ({ row }) => {
            return (
                <span
                    className={`whitespace-nowrap flex items-center gap-x-1 font-medium ${
                        row.original.restDay
                            ? "text-foreground/60"
                            : "text-foreground"
                    }`}
                >
                    {row.original.restDay ? (
                        <Timer1 variant="Bold" size={20} color="#1818186A" />
                    ) : (
                        <Flash variant="Bold" size={20} color="#66A786" />
                    )}
                    {row.original.restDay ? "Rest" : "Workout"}
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

            const handleOpenEdit = () => {
                setopen(true);
                setSelectedWorkout(row.original);
            };

            return (
                <div className="flex gap-x-2 items-center">
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
                        </div>
                    )}
                </div>
            );
        },
    },
];
