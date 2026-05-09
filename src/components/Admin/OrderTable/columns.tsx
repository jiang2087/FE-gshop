"use client"

import { ColumnDef } from "@tanstack/react-table"
import dayjs from "dayjs"
import { Eye, Edit, ArrowUpDown, ArrowUp, ArrowDown, Package, User, Phone, CreditCard, Calendar } from "lucide-react"

import { OrderStatus } from "@/api/adminApi"

export type OrderAdminResponse = {
    id: number
    orderCode: string
    customerName: string
    phone: string
    totalPrice: number
    paymentMethod: string
    status: OrderStatus
    createdAt: string
}

const statusConfig = {
    PENDING: {
        label: "Pending",
        className: "bg-yellow-light-4 text-yellow-dark-2 dark:bg-dark-3 dark:text-yellow-light",
        dot: "bg-yellow"
    },
    PROCESSING: {
        label: "Processing",
        className: "bg-blue-light-5 text-blue dark:bg-blue-dark/20 dark:text-blue-light",
        dot: "bg-blue"
    },
    SHIPPED: {
        label: "Shipped",
        className: "bg-primary/10 text-primary dark:bg-primary/20 dark:text-primary",
        dot: "bg-primary"
    },
    COMPLETED: {
        label: "Completed",
        className: "bg-green-light-6 text-green dark:bg-dark-3 dark:text-green-light",
        dot: "bg-green"
    },
    CANCELLED: {
        label: "Cancelled",
        className: "bg-red-light-6 text-red dark:bg-dark-3 dark:text-red-light",
        dot: "bg-red"
    }
}


export const columns: ColumnDef<OrderAdminResponse>[] = [
    {
        accessorKey: "orderCode",
        header: ({ column }) => (
            <button
                className="flex items-center gap-2 hover:text-blue transition-colors font-bold"
                onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            >
                Order Code
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
            const orderCode = row.getValue("orderCode") as string
            return (
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-light-5 rounded-lg text-blue">
                        <Package className="h-5 w-5" />
                    </div>
                    <div className="flex flex-col">
                        <span className="font-bold text-dark-2 dark:text-meta-5 uppercase tracking-wider">#{orderCode}</span>
                        <span className="text-[11px] text-slate-400 font-medium uppercase mt-0.5">ID: {row.original.id}</span>
                    </div>
                </div>
            )
        }
    },
    {
        accessorKey: "customerName",
        header: "Customer",
        cell: ({ row }) => (
            <div className="flex flex-col gap-1">
                <div className="flex items-center gap-2 font-bold text-dark-2 dark:text-stroke">
                    <User className="h-3.5 w-3.5 text-dark-2 dark:text-stroke" />
                    {row.getValue("customerName")}
                </div>
                <div className="flex items-center gap-2 text-xs text-green-light-2 dark:text-stroke">
                    <Phone className="h-3.5 w-3.5 text-dark-2 dark:text-stroke" />
                    {row.original.phone}
                </div>
            </div>
        )
    },
    {
        accessorKey: "totalPrice",
        header: ({ column }) => (
            <div className="flex justify-center">
                <button
                    className="flex items-center gap-2 hover:text-blue transition-colors font-bold"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Amount
                    {column.getIsSorted() === "asc" ? (
                        <ArrowUp className="h-4 w-4" />
                    ) : column.getIsSorted() === "desc" ? (
                        <ArrowDown className="h-4 w-4" />
                    ) : (
                        <ArrowUpDown className="h-4 w-4 opacity-50" />
                    )}
                </button>
            </div>
        ),
        cell: ({ row }) => {
            const amount = parseFloat(row.getValue("totalPrice"))
            return (
                <div className="flex flex-col items-center">
                    <span className="text-sm font-bold text-dark-2 dark:text-stroke">
                        {new Intl.NumberFormat('en-US', {
                            style: 'currency',
                            currency: 'USD'
                        }).format(amount)}
                    </span>
                    <div className="flex items-center gap-1 text-[10px] text-teal font-bold uppercase mt-1">
                        <CreditCard className="h-3 w-3 text-teal-dark" />
                        {row.original.paymentMethod}
                    </div>
                </div>
            )
        }
    },
    {
        accessorKey: "status",
        header: () => <div className="text-center">Status</div>,
        cell: ({ row }) => {
            const status = row.getValue("status") as OrderStatus
            const config = statusConfig[status] || statusConfig.PENDING

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
        accessorKey: "createdAt",
        header: ({ column }) => (
            <div className="flex justify-center">
                <button
                    className="flex items-center gap-2 hover:text-blue transition-colors font-bold"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Date
                    {column.getIsSorted() === "asc" ? (
                        <ArrowUp className="h-4 w-4" />
                    ) : column.getIsSorted() === "desc" ? (
                        <ArrowDown className="h-4 w-4" />
                    ) : (
                        <ArrowUpDown className="h-4 w-4 opacity-50" />
                    )}
                </button>
            </div>
        ),
        cell: ({ row }) => {
            const date = row.getValue("createdAt") as string
            return (
                <div className="flex flex-col items-center">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-dark-2 dark:text-meta-5">
                        <Calendar className="h-3.5 w-3.5 text-slate-400" />
                        {dayjs(date).format("MMM DD, YYYY")}
                    </div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase mt-1">
                        {dayjs(date).format("hh:mm A")}
                    </span>
                </div>
            )
        }
    },
    {
        id: "actions",
        header: () => <div className="text-center">Actions</div>,
        cell: ({ row, table }) => {
            const order = row.original
            const { onView, onUpdateStatus } = table.options.meta as any

            return (
                <div className="flex gap-2 justify-center">
                    <button
                        onClick={() => onView?.(order)}
                        className="p-2 text-slate-400 hover:text-blue hover:bg-blue-light-5 dark:hover:bg-dark-3 rounded-xl transition-all active:scale-90"
                        title="View details"
                    >
                        <Eye className="h-5 w-5 text-blue-light" />
                    </button>
                    <button
                        onClick={() => onUpdateStatus?.(order)}
                        className="p-2 text-slate-400 hover:text-yellow hover:bg-yellow-light-6 dark:hover:bg-dark-3 rounded-xl transition-all active:scale-90"
                        title="Update status"
                    >
                        <Edit className="h-5 w-5 text-yellow" />
                    </button>

                </div>
            )
        }
    }
]
