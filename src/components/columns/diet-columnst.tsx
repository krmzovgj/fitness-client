"use client";

import { dayColors } from "@/lib/utils";
import type { Diet } from "@/model/diet";
import { UserRole } from "@/model/user";
import { useUserStore } from "@/store/user";
import type { ColumnDef } from "@tanstack/react-table";
import { Edit, ExportSquare } from "iconsax-reactjs";
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
            const navigate = useNavigate();
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

                    <Button
                        onClick={() =>
                            navigate(`/client/${row.original.id}/meals`, {
                                state: {
                                    name: row.original.name,
                                    day: row.original.day,
                                },
                            })
                        }
                        variant="outline"
                    >
                        <ExportSquare
                            variant="Bold"
                            size={18}
                            color="#292929"
                        />
                        Open
                    </Button>
                </div>
            );
        },
    },
];
