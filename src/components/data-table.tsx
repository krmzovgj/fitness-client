"use client";

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    type ColumnDef,
    flexRender,
    getCoreRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    type SortingState,
    useReactTable,
} from "@tanstack/react-table";
import { AnimatePresence, motion } from "framer-motion";
import { ArrangeVertical } from "iconsax-reactjs";
import * as React from "react";

interface DataTableProps<T> {
    columns: ColumnDef<T>[];
    data: T[];
    enableSorting?: boolean;
}

export function DataTable<T>({
    columns,
    data,
    enableSorting,
}: DataTableProps<T>) {
    const [sorting, setSorting] = React.useState<SortingState>([]);

    const table = useReactTable({
        data,
        columns,
        state: { sorting },
        onSortingChange: setSorting,
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
    });

    return (
        <div className="space-y-4">
            <div className="overflow-auto border rounded-2xl">
                <Table>
                    <TableHeader>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map((header) => (
                                    <TableHead
                                        className="h-14 py-2 px-4  whitespace-nowrap"
                                        key={header.id}
                                    >
                                        {header.isPlaceholder ? null : header.column.getCanSort() &&
                                          enableSorting ? (
                                            <button
                                                className="cursor-pointer bg-transparent flex items-center gap-x-2 text-foreground hover:bg-transparent"
                                                onClick={() =>
                                                    header.column.toggleSorting(
                                                        header.column.getIsSorted() ===
                                                            "asc"
                                                    )
                                                }
                                            >
                                                {
                                                    header.column.columnDef
                                                        .header as React.ReactNode
                                                }
                                                <ArrangeVertical
                                                    variant="Bulk"
                                                    size={14}
                                                    color="#000"
                                                />
                                            </button>
                                        ) : (
                                            (header.column.columnDef
                                                .header as React.ReactNode)
                                        )}
                                    </TableHead>
                                ))}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody>
                        <AnimatePresence mode="popLayout" initial={false}>
                            {table.getRowModel().rows.map((row) => (
                                <motion.tr
                                    layout // This is the ONLY thing you need for perfect add/delete shifts
                                    key={row.id}
                                    // No initial/animate/exit = no slide-in on mount or refresh
                                    // Framer Motion's `layout` + `AnimatePresence mode="popLayout"` handles everything
                                    className={
                                        row.index % 2 === 0
                                            ? "bg-muted/50"
                                            : "bg-transparent"
                                    }
                                    style={{ originY: 0 }} // optional: smoother vertical shift
                                >
                                    {row.getVisibleCells().map((cell) => (
                                        <TableCell key={cell.id}>
                                            <motion.div layout="position">
                                                {/* Wrap cell content so text doesn't jump during layout shift */}
                                                {flexRender(
                                                    cell.column.columnDef.cell,
                                                    cell.getContext()
                                                )}
                                            </motion.div>
                                        </TableCell>
                                    ))}
                                </motion.tr>
                            ))}
                        </AnimatePresence>
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}
