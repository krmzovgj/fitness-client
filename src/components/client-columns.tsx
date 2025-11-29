"use client";

import { type User } from "@/model/user";
import { type ColumnDef } from "@tanstack/react-table";
import { ExportSquare } from "iconsax-reactjs";
import { useNavigate } from "react-router-dom";
import { Avatar } from "./ui/avatar";

export const clientColumns: ColumnDef<User>[] = [
    // FULL NAME (computed)
    {
        accessorFn: (row) => `${row.firstName} ${row.lastName}`,
        id: "fullName",
        header: "Full Name",
        cell: ({ row }) => {
            const user = row.original;
            return (
                <div className="flex w-full items-center gap-3">
                    {user && (
                        <Avatar
                            firstName={user?.firstName}
                            lastName={user.lastName}
                            size={34}
                        />
                    )}
                    <div>
                        <div className="w-full font-semibold text-md">
                            {user.firstName} {user.lastName}
                        </div>

                        <h2 className="text-foreground/80 font-medium -mt-0.5 text-sm">
                            {user.email}
                        </h2>
                    </div>
                </div>
            );
        },
    },

    {
        accessorKey: "age",
        header: "Age",
        cell: ({ row }) => <span>{row.original.age}</span>,
    },

    {
        accessorKey: "height",
        header: "Height",
        cell: ({ row }) => (
            <span>
                {row.original.height}{" "}
                <span className="text-xs font-bold -ml-0.5 text-foreground/60">
                    cm
                </span>
            </span>
        ),
    },

    {
        accessorKey: "weight",
        header: "Weight",
        cell: ({ row }) => (
            <div className="flex items-center gap-1">
                <span>
                    {row.original.weight}{" "}
                    <span className="text-xs font-bold -ml-0.5 text-foreground/60">
                        kg
                    </span>
                </span>
            </div>
        ),
    },

    {
        accessorKey: "gender",
        header: "Gender",
        cell: ({ row }) => (
            <span
                style={{
                    color:
                        row.original.gender === "FEMALE"
                            ? "#9B5DE5"
                            : "#66A786",
                }}
            >
                {row.original.gender}
            </span>
        ),
    },

    {
        accessorKey: "role",
        header: "Role",
        cell: ({ row }) => {
            const role = row.original.role;
            return <span>{role}</span>;
        },
    },

    {
        id: "actions",
        header: "",
        cell: ({ row }) => {
            const navigate = useNavigate();
            const user = row.original;

            return (
                <div
                    onClick={() => navigate(`/client/${user.id}`)}
                    className="flex hover:underline cursor-pointer gap-x-1 items-center"
                >
                    <h2>Open</h2>
                    <ExportSquare variant="Bold" size={14} color="#000" />
                </div>
            );
        },
    },
];
