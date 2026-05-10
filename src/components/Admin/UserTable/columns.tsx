"use client"

import { ColumnDef } from "@tanstack/react-table"
import Image from "next/image"
import { ArrowUpDown, ArrowUp, ArrowDown, User, Mail, ShieldAlert } from "lucide-react"
import { UserAdminResponse } from "@/api/adminApi"

const statusConfig: Record<string, { label: string, className: string, dot: string }> = {
    ACTIVE: {
        label: "Active",
        className: "bg-green-light-6 text-green dark:bg-dark-3 dark:text-green-light",
        dot: "bg-green"
    },
    INACTIVE: {
        label: "Inactive",
        className: "bg-yellow-light-4 text-yellow-dark-2 dark:bg-dark-3 dark:text-yellow-light",
        dot: "bg-yellow"
    },
    BLOCKED: {
        label: "Blocked",
        className: "bg-red-light-6 text-red dark:bg-dark-3 dark:text-red-light",
        dot: "bg-red"
    }
}

export const columns: ColumnDef<UserAdminResponse>[] = [
    {
        accessorKey: "username",
        header: ({ column }) => (
            <button
                className="flex items-center gap-2 hover:text-blue transition-colors font-bold"
                onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            >
                User
                {column.getIsSorted() === "asc" ? (
                    <ArrowUp className="h-4 w-4" />
                ) : column.getIsSorted() === "desc" ? (
                    <ArrowDown className="h-4 w-4" />
                ) : (
                    <ArrowUpDown className="h-4 w-4 opacity-50" />
                )}
            </button>
        ),
        cell: ({ row }) => {
            const username = row.getValue("username") as string;
            const imageUrl = row.original.imageUrl;
            
            return (
                <div className="flex items-center gap-3">
                    <div className="h-10 w-10 flex-shrink-0 relative rounded-full overflow-hidden bg-gray-2 dark:bg-dark-3 border-2 border-white dark:border-dark-3 shadow-sm">
                        {imageUrl ? (
                            <Image
                                src={imageUrl}
                                alt={username}
                                fill
                                className="object-cover"
                            />
                        ) : (
                            <div className="flex h-full w-full items-center justify-center bg-blue-light-5 text-blue">
                                <User className="h-5 w-5" />
                            </div>
                        )}
                    </div>
                    <div className="flex flex-col">
                        <span className="font-bold text-dark-2 dark:text-meta-5 tracking-wide">{username}</span>
                        <span className="text-[11px] text-slate-400 font-medium uppercase mt-0.5">ID: {row.original.id}</span>
                    </div>
                </div>
            )
        }
    },
    {
        accessorKey: "email",
        header: ({ column }) => (
            <button
                className="flex items-center gap-2 hover:text-blue transition-colors font-bold"
                onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            >
                Email
                {column.getIsSorted() === "asc" ? (
                    <ArrowUp className="h-4 w-4" />
                ) : column.getIsSorted() === "desc" ? (
                    <ArrowDown className="h-4 w-4" />
                ) : (
                    <ArrowUpDown className="h-4 w-4 opacity-50" />
                )}
            </button>
        ),
        cell: ({ row }) => (
            <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
                <Mail className="h-4 w-4" />
                {row.getValue("email")}
            </div>
        )
    },
    {
        accessorKey: "status",
        header: () => <div className="text-center">Status</div>,
        cell: ({ row }) => {
            const status = (row.getValue("status") as string)?.toUpperCase() || "INACTIVE"
            const config = statusConfig[status] || statusConfig.INACTIVE

            return (
                <div className="flex justify-center">
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider shadow-sm ${config.className}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${config.dot}`}></span>
                        {config.label}
                    </span>
                </div>
            )
        }
    },
    {
        id: "actions",
        header: () => <div className="text-center">Actions</div>,
        cell: ({ row, table }) => {
            const user = row.original
            const { onUpdateStatus } = table.options.meta as any

            return (
                <div className="flex gap-2 justify-center">
                    <button
                        onClick={() => onUpdateStatus?.(user)}
                        className="p-2 text-slate-400 hover:text-red hover:bg-red-light-6 dark:hover:bg-dark-3 rounded-xl transition-all active:scale-90"
                        title="Update status"
                    >
                        <ShieldAlert className="h-5 w-5 text-red-light" />
                    </button>
                </div>
            )
        }
    }
]
