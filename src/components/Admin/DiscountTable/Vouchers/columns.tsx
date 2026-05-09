"use client"

import { ColumnDef } from "@tanstack/react-table"
import dayjs from "dayjs"
import { Ticket, Edit, Trash2, ArrowUpDown, ArrowUp, ArrowDown, Calendar, CheckCircle2, XCircle, Info } from "lucide-react"
import { VoucherAdminResponse } from "@/api/adminApi"

export const columns: ColumnDef<VoucherAdminResponse>[] = [
    {
        accessorKey: "code",
        header: ({ column }) => (
            <button
                className="flex items-center gap-2 hover:text-blue transition-colors font-bold"
                onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            >
                Voucher Code
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
                <div className="p-2 bg-yellow-light-6 rounded-lg text-yellow">
                    <Ticket className="h-5 w-5" />
                </div>
                <div className="flex flex-col">
                    <span className="font-bold text-dark-2 dark:text-meta-5 tracking-tight uppercase">#{row.getValue("code")}</span>
                    <span className="text-[11px] text-slate-400 font-medium uppercase mt-0.5">ID: {row.original.id}</span>
                </div>
            </div>
        )
    },
    {
        accessorKey: "type",
        header: "Voucher Type",
        cell: ({ row }) => {
            const type = row.getValue("type") as string
            return (
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold ${type === "SHIPPING"
                    ? "bg-blue-light-5 text-blue"
                    : "bg-green-light-6 text-green"
                    }`}>
                    {type}
                </span>
            )
        }
    },
    {
        accessorKey: "value",
        header: "Value",
        cell: ({ row }) => {
            const discType = row.original.discountType
            const value = row.getValue("value") as number
            return (
                <div className="flex flex-col">
                    <span className="font-bold text-dark-2 dark:text-stroke">
                        {discType === "PERCENTAGE" ? `${value}%` : `$${value}`}
                    </span>
                    <span className="text-[10px] text-slate-400 font-medium uppercase">
                        {discType === "PERCENTAGE" ? "Off" : "Discount"}
                    </span>
                </div>
            )
        }
    },
    {
        accessorKey: "usage",
        header: "Usage",
        cell: ({ row }) => {
            const used = row.original.usedCount
            const total = row.original.quantity
            const percent = (used / total) * 100
            return (
                <div className="flex flex-col gap-1.5 w-32">
                    <div className="flex justify-between items-center text-[11px] font-bold">
                        <span className="text-dark-2 dark:text-meta-5">{used} / {total}</span>
                        <span className="text-slate-400">{Math.round(percent)}%</span>
                    </div>
                    <div className="h-1.5 w-full bg-gray-2 dark:bg-dark-3 rounded-full overflow-hidden">
                        <div
                            className={`h-full transition-all duration-500 rounded-full ${percent > 80 ? "bg-red" : percent > 50 ? "bg-yellow" : "bg-blue"
                                }`}
                            style={{ width: `${percent}%` }}
                        ></div>
                    </div>
                </div>
            )
        }
    },
    {
        accessorKey: "limits",
        header: "Limits",
        cell: ({ row }) => (
            <div className="flex flex-col gap-1">
                <div className="flex items-center gap-1 text-[11px] font-bold text-slate-500">
                    <Info className="h-3 w-3" />
                    Min: ${row.original.minOrderValue}
                </div>
                {row.original.discountType === "PERCENTAGE" && (
                    <div className="flex items-center gap-1 text-[11px] font-bold text-slate-500">
                        <Info className="h-3 w-3" />
                        Max: ${row.original.maxDiscount}
                    </div>
                )}
            </div>
        )
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
                        <Calendar className="h-3.5 w-3.5 text-slate-400" />
                        {dayjs(start).format("MMM DD, YYYY")}
                    </div>
                    <div className="text-[10px] text-slate-400 font-bold uppercase pl-5">
                        Until {dayjs(end).format("MMM DD, YYYY")}
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
                        <span className="inline-flex items-center gap-1 text-green font-bold text-xs uppercase bg-green-light-6 px-2 py-1 rounded-lg">
                            <CheckCircle2 className="h-3.5 w-3.5" />
                            Active
                        </span>
                    ) : (
                        <span className="inline-flex items-center gap-1 text-red font-bold text-xs uppercase bg-red-light-6 px-2 py-1 rounded-lg">
                            <XCircle className="h-3.5 w-3.5" />
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
            const voucher = row.original
            const { onEdit, onDelete } = table.options.meta as any

            return (
                <div className="flex gap-2 justify-center">
                    <button
                        onClick={() => onEdit?.(voucher)}
                        className="p-2 text-slate-400 hover:text-blue hover:bg-blue-light-5 dark:hover:bg-dark-3 rounded-xl transition-all active:scale-90"
                        title="Edit"
                    >
                        <Edit className="h-5 w-5 text-blue-light" />
                    </button>
                    <button
                        onClick={() => onDelete?.(voucher)}
                        className="p-2 text-slate-400 hover:text-red hover:bg-red-light-6 dark:hover:bg-dark-3 rounded-xl transition-all active:scale-90"
                        title="Delete"
                    >
                        <Trash2 className="h-5 w-5 text-red-light" />
                    </button>
                </div>
            )
        }
    }
]
