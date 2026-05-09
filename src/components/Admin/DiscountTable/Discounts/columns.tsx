"use client"

import { ColumnDef } from "@tanstack/react-table"
import dayjs from "dayjs"
import { Tag, Edit, Trash2, ArrowUpDown, ArrowUp, ArrowDown, Calendar, CheckCircle2, XCircle } from "lucide-react"
import { DiscountAdminResponse } from "@/api/adminApi"

export const columns: ColumnDef<DiscountAdminResponse>[] = [
    {
        accessorKey: "name",
        header: ({ column }) => (
            <button
                className="flex items-center gap-2 hover:text-blue transition-colors font-bold"
                onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            >
                Name
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
            <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-light-5 rounded-lg text-blue">
                    <Tag className="h-5 w-5" />
                </div>
                <div className="flex flex-col">
                    <span className="font-bold text-dark-2 dark:text-meta-5 tracking-tight">{row.getValue("name")}</span>
                    <span className="text-[11px] text-slate-400 font-medium uppercase mt-0.5">ID: {row.original.id}</span>
                </div>
            </div>
        )
    },
    {
        accessorKey: "type",
        header: "Type",
        cell: ({ row }) => {
            const type = row.getValue("type") as string
            return (
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold ${type === "PERCENTAGE"
                        ? "bg-purple-light-5 text-purple"
                        : "bg-teal-light-5 text-teal"
                    }`}>
                    {type === "PERCENTAGE" ? "Percentage" : "Fixed Amount"}
                </span>
            )
        }
    },
    {
        accessorKey: "value",
        header: "Value",
        cell: ({ row }) => {
            const type = row.original.type
            const value = row.getValue("value") as number
            return (
                <span className="font-bold text-dark-2 dark:text-stroke">
                    {type === "PERCENTAGE" ? `${value}%` : `$${value}`}
                </span>
            )
        }
    },
    {
        accessorKey: "startDate",
        header: "Duration",
        cell: ({ row }) => {
            const start = row.original.startDate
            const end = row.original.endDate
            return (
                <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-dark-2 dark:text-meta-5">
                        <Calendar className="h-3 w-3 text-slate-400" />
                        {dayjs(start).format("MMM DD, YYYY")} - {dayjs(end).format("MMM DD, YYYY")}
                    </div>
                </div>
            )
        }
    },
    {
        accessorKey: "active",
        header: () => <div className="text-center">Status</div>,
        cell: ({ row }) => {
            const active = row.getValue("active") as boolean
            return (
                <div className="flex justify-center">
                    {active ? (
                        <span className="inline-flex items-center gap-1 text-green font-bold text-xs uppercase">
                            <CheckCircle2 className="h-4 w-4" />
                            Active
                        </span>
                    ) : (
                        <span className="inline-flex items-center gap-1 text-red font-bold text-xs uppercase">
                            <XCircle className="h-4 w-4" />
                            Inactive
                        </span>
                    )}
                </div>
            )
        }
    },
    {
        id: "actions",
        header: () => <div className="text-center">Actions</div>,
        cell: ({ row, table }) => {
            const discount = row.original
            const { onEdit, onDelete } = table.options.meta as any

            return (
                <div className="flex gap-2 justify-center">
                    <button
                        onClick={() => onEdit?.(discount)}
                        className="p-2 text-slate-400 hover:text-blue hover:bg-blue-light-5 dark:hover:bg-dark-3 rounded-xl transition-all"
                        title="Edit"
                    >
                        <Edit className="h-5 w-5 text-blue-light" />
                    </button>
                    <button
                        onClick={() => onDelete?.(discount)}
                        className="p-2 text-slate-400 hover:text-red hover:bg-red-light-6 dark:hover:bg-dark-3 rounded-xl transition-all"
                        title="Delete"
                    >
                        <Trash2 className="h-5 w-5 text-red-light" />
                    </button>
                </div>
            )
        }
    }
]
