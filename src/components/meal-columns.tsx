import { dayColors } from "@/lib/utils";
import type { Meal } from "@/model/meal";
import { type ColumnDef } from "@tanstack/react-table";

interface MealColumnsProp {}

export const getMealColumns = ({}: MealColumnsProp): ColumnDef<Meal>[] => [
    {
        accessorKey: "day",
        header: "Day",
        cell: ({ row }) => {
            const dayValue = row.original.day;
            const dayInfo = dayColors.find((d) => d.day === dayValue);

            return (
                <span className="whitespace-nowrap flex items-center gap-x-2">
                    <div
                        style={{ backgroundColor: dayInfo?.color }}
                        className="w-2 h-2 rounded-full"
                    />
                    {dayValue}
                </span>
            );
        },
    },
    {
        accessorKey: "name",
        header: "Name",
    },
    {
        accessorKey: "description",
        header: "Description",
    },
    {
        accessorKey: "type",
        header: "Meal Type",
    },
    {
        accessorKey: "cal",
        header: "Cal",
        cell: ({ row }) => (
            <span className="flex">
                {row.original.cal}
                <span className="text-sm font-semibold text-foreground/70">
                    g
                </span>
            </span>
        ),
    },
    {
        accessorKey: "protein",
        header: "Protein",
        cell: ({ row }) => (
            <span className="flex">
                {row.original.protein}
                <span className="text-sm font-semibold text-foreground/70">
                    g
                </span>
            </span>
        ),
    },
];
