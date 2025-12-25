"use client";

import { dayColors, formatDate } from "@/lib/utils";
import type { Diet } from "@/model/diet";
import { UserRole } from "@/model/user";
import { useUserStore } from "@/store/user";
import type { ColumnDef } from "@tanstack/react-table";
import { Calendar, Edit } from "iconsax-reactjs";
import { useNavigate } from "react-router-dom";
import { Button } from "../ui/button";

export const dietColumns = (
    setSelectedDiet: (diet: Diet) => void,
    setopen: (open: boolean) => void
): ColumnDef<Diet>[] => [
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
                    onClick={() =>
                        navigate(`/client/${row.original.id}/meals`, {
                            state: {
                                name: row.original.name,
                                day: row.original.day,
                            },
                        })
                    }
                    className="flex cursor-pointer items-center gap-x-2"
                >
                    <Calendar variant="Bulk" size={20} color={matched.color} />
                    <h2 className="">{matched.day}</h2>
                </span>
            );
        },
    },
    {
        accessorKey: "name",
        header: "Diet Name",
        cell: ({ row }) => {
            const navigate = useNavigate();

            return (
                <span
                    onClick={() =>
                        navigate(`/client/${row.original.id}/meals`, {
                            state: {
                                name: row.original.name,
                                day: row.original.day,
                            },
                        })
                    }
                    className="cursor-pointer whitespace-nowrap"
                >
                    {row.original.name}
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
                setSelectedDiet(row.original);
            };

            return (
                <div className="flex items-center gap-x-2">
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
