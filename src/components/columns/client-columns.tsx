"use client";

import { UserRole, type User } from "@/model/user";
import { type ColumnDef } from "@tanstack/react-table";
import { Edit, ExportSquare, Trash } from "iconsax-reactjs";
import { useNavigate } from "react-router-dom";
import { Avatar } from "../ui/avatar";
import { formatDate } from "@/lib/utils";
import { useUserStore } from "@/store/user";
import { useAuthStore } from "@/store/auth";
import { useState } from "react";
import { deleteUser } from "@/api/user";
import { Button } from "../ui/button";
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
import { Spinner } from "../ui/spinner";

export const clientColumns = (
    setSelectedUser: (user: User | null) => void,
    setopen: (open: boolean) => void,
    handleGetClients: () => void
): ColumnDef<User>[] => [
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
        accessorKey: "createdAt",
        header: "Created At",
        cell: ({ row }) => {
            return <span className="whitespace-nowrap">{formatDate(row.original.createdAt)}</span>;
        },
    },
    {
        id: "actions",
        header: "",
        cell: ({ row }) => {
            const { user } = useUserStore();
            const { token } = useAuthStore();
            const [openAlertDialog, setOpenAlertDialog] = useState(false);
            const [deletingClient, setdeletingClient] = useState(false);

            if (user?.role === UserRole.CLIENT) return null;

            const handleOpenEdit = () => {
                setopen(true);
                setSelectedUser(row.original);
            };

            const handleDeleteClient = async () => {
                try {
                    setdeletingClient(true);

                    const response = await deleteUser(row.original.id, token!);

                    if (response.status === 200) {
                        handleGetClients();
                        setOpenAlertDialog(false);
                    }
                } finally {
                    setdeletingClient(false);
                }
            };

            return (
                <div className="whitespace-nowrap">
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

                            <AlertDialog
                                open={openAlertDialog}
                                onOpenChange={setOpenAlertDialog}
                            >
                                <AlertDialogTrigger asChild>
                                    <Button variant="outline">
                                        <Trash
                                            variant="Bulk"
                                            size={18}
                                            color="red"
                                        />
                                        Delete
                                    </Button>
                                </AlertDialogTrigger>

                                <AlertDialogContent>
                                    <AlertDialogHeader>
                                        <AlertDialogTitle>
                                            Delete client
                                        </AlertDialogTitle>
                                        <AlertDialogDescription>
                                            Are you sure you want to delete this
                                            client? This action is irreversible.
                                        </AlertDialogDescription>
                                    </AlertDialogHeader>

                                    <AlertDialogFooter>
                                        <AlertDialogCancel>
                                            Cancel
                                        </AlertDialogCancel>

                                        <Button
                                            variant="destructive"
                                            onClick={handleDeleteClient}
                                        >
                                            {deletingClient ? (
                                                <Spinner className="size-6" />
                                            ) : (
                                                "Delete Client"
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

    {
        id: "open",
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
