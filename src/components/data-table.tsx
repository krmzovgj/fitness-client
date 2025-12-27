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
                                        className="h-14 py-2 px-4 bg-background  whitespace-nowrap"
                                        key={header.id}
                                    >
                                        {header.isPlaceholder ? null : header.column.getCanSort() &&
                                          enableSorting ? (
                                            <button
                                                className="cursor-pointer bg-background flex items-center gap-x-2 text-foreground hover:bg-background"
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
                                    layout
                                    key={row.id}
                                    className={
                                        row.index % 2 === 0
                                            ? "bg-secondary"
                                            : "bg-background"
                                    }
                                    style={{ originY: 0 }}
                                >
                                    {row.getVisibleCells().map((cell) => (
                                        <TableCell key={cell.id}>
                                            <motion.div layout="position">
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
