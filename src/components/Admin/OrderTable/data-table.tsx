"use client"

import { useEffect, useState, useCallback } from "react"
import {
    ColumnDef,
    flexRender,
    getCoreRowModel,
    getSortedRowModel,
    SortingState,
    useReactTable,
} from "@tanstack/react-table"
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, Search, Filter, X, Edit } from "lucide-react"
import { toast } from "react-hot-toast"
import { getAllOrders, updateOrderStatus, OrderStatus } from "@/api/adminApi"
import OrderItemModal from "./OrderItemModal"

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"

interface DataTableProps<TData, TValue> {
    columns: ColumnDef<TData, TValue>[]
    status?: string
    orderCode?: string
}

const validTransitions: Record<string, string[]> = {
    PENDING: ["PROCESSING", "CANCELLED"],
    PROCESSING: ["SHIPPED", "CANCELLED"],
    SHIPPED: ["COMPLETED"],
    COMPLETED: [],
    CANCELLED: [],
};

export function OrderTable<TData, TValue>({
    columns,
    status,
    orderCode
}: DataTableProps<TData, TValue>) {
    const [data, setData] = useState<TData[]>([])
    const [isLoading, setIsLoading] = useState(true)

    // Pagination state
    const [pageIndex, setPageIndex] = useState(0)
    const [pageSize, setPageSize] = useState(10)
    const [totalPages, setTotalPages] = useState(0)
    const [totalElements, setTotalElements] = useState(0)
    const [sorting, setSorting] = useState<SortingState>([])

    // Modal state
    const [selectedOrder, setSelectedOrder] = useState<any>(null)

    const [isViewModalOpen, setIsViewModalOpen] = useState(false)
    const [isStatusModalOpen, setIsStatusModalOpen] = useState(false)
    const [pendingStatus, setPendingStatus] = useState<OrderStatus | null>(null)

    const fetchOrders = useCallback(async () => {
        setIsLoading(true)
        try {
            const sortParam = sorting.length > 0 ? {
                field: sorting[0].id,
                direction: sorting[0].desc ? 'desc' as const : 'asc' as const
            } : undefined;

            const result = await getAllOrders({
                page: pageIndex,
                size: pageSize,
                sort: sortParam,
                status,
                orderCode
            })

            setData(result.content as TData[])
            setTotalPages(result.page?.totalPages || 0)
            setTotalElements(result.page?.totalElements || 0)
        } catch (error) {
            console.error("Error loading orders:", error)
            toast.error("Failed to load orders")
        } finally {
            setIsLoading(false)
        }
    }, [pageIndex, pageSize, sorting, status, orderCode])

    const [prevOrderCode, setPrevOrderCode] = useState<string | undefined>(undefined)

    useEffect(() => {
        const loadData = async () => {
            await fetchOrders()

            setPrevOrderCode(orderCode)
        }

        loadData()
    }, [fetchOrders, orderCode])



    const handleUpdateStatus = async (newStatus: OrderStatus) => {
        if (!selectedOrder) return
        try {
            await updateOrderStatus(selectedOrder.id, newStatus)
            setIsStatusModalOpen(false)
            setSelectedOrder(null)
            toast.success("Order status updated successfully")
            fetchOrders()
        } catch (error) {
            toast.error("Failed to update order status")
        }
    }

    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
        onSortingChange: setSorting,
        getSortedRowModel: getSortedRowModel(),
        state: {
            sorting,
        },
        manualSorting: true,
        meta: {
            onView: (order: any) => {
                setSelectedOrder(order)
                setIsViewModalOpen(true)
            },

            onUpdateStatus: (order: any) => {
                setSelectedOrder(order)
                setPendingStatus(order.status)
                setIsStatusModalOpen(true)
            },
        },
    })

    return (
        <div className="space-y-4">
            {/* Table Container */}
            <div className="overflow-hidden rounded-2xl bg-white dark:bg-gray-dark shadow-sm border border-stroke dark:border-stroke-dark transition-all duration-300">
                <Table>
                    <TableHeader>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id} className="bg-gray-1 dark:bg-dark-2/50 border-b border-stroke dark:border-stroke-dark">
                                {headerGroup.headers.map((header) => (
                                    <TableHead key={header.id} className="text-dark-2 dark:text-meta-5 font-bold h-14 text-sm px-6">
                                        {header.isPlaceholder
                                            ? null
                                            : flexRender(
                                                header.column.columnDef.header,
                                                header.getContext()
                                            )}
                                    </TableHead>
                                ))}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody>
                        {isLoading ? (
                            <TableRow>
                                <TableCell colSpan={columns.length} className="h-32 text-center">
                                    <div className="flex flex-col items-center justify-center gap-3">
                                        <div className="w-8 h-8 border-3 border-blue dark:border-meta-5 border-t-transparent rounded-full animate-spin"></div>
                                        <span className="text-sm font-bold text-slate-400 uppercase tracking-widest">Loading orders...</span>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ) : table.getRowModel().rows?.length ? (
                            table.getRowModel().rows.map((row) => (
                                <TableRow
                                    key={row.id}
                                    className="hover:bg-gray-1 dark:hover:bg-dark-2/20 transition-colors border-b border-stroke dark:border-stroke-dark last:border-0"
                                >
                                    {row.getVisibleCells().map((cell) => (
                                        <TableCell key={cell.id} className="py-4 px-6">
                                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={columns.length} className="h-32 text-center">
                                    <div className="flex flex-col items-center justify-center gap-2 opacity-40">
                                        <Filter className="h-10 w-10 text-slate-400" />
                                        <span className="text-sm font-bold text-slate-400 uppercase tracking-wider">No orders found.</span>
                                    </div>
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>

            {/* Pagination Controls */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-2 py-2">
                <div className="text-sm font-bold text-slate-500 dark:text-meta-5">
                    Showing <span className="text-blue dark:text-blue-light">{data.length}</span> of <span className="text-dark-2 dark:text-meta-5">{totalElements}</span> orders
                </div>

                <div className="flex items-center gap-6">
                    <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Rows:</span>
                        <select
                            value={pageSize}
                            onChange={(e) => {
                                setPageSize(Number(e.target.value))
                                setPageIndex(0)
                            }}
                            className="h-9 w-20 rounded-xl border border-stroke dark:border-stroke-dark bg-white dark:bg-dark-2 px-2 text-sm font-bold text-dark-2 dark:text-meta-5 focus:outline-none focus:ring-2 focus:ring-blue/20 transition-all"
                        >
                            {[10, 20, 30, 40, 50].map((size) => (
                                <option key={size} value={size}>
                                    {size}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="flex items-center gap-1">
                        <button
                            onClick={() => setPageIndex(0)}
                            disabled={pageIndex === 0}
                            className="p-2 rounded-xl hover:bg-gray-2 dark:hover:bg-dark-2 disabled:opacity-30 disabled:cursor-not-allowed transition-all text-dark-2 dark:text-meta-5"
                        >
                            <ChevronsLeft className="h-5 w-5" />
                        </button>
                        <button
                            onClick={() => setPageIndex(prev => Math.max(0, prev - 1))}
                            disabled={pageIndex === 0}
                            className="p-2 rounded-xl hover:bg-gray-2 dark:hover:bg-dark-2 disabled:opacity-30 disabled:cursor-not-allowed transition-all text-dark-2 dark:text-meta-5"
                        >
                            <ChevronLeft className="h-5 w-5" />
                        </button>

                        <div className="flex items-center px-4">
                            <span className="text-sm font-bold text-dark-2 dark:text-meta-5">
                                {pageIndex + 1} <span className="mx-1 text-slate-300 font-normal">/</span> {totalPages || 1}
                            </span>
                        </div>

                        <button
                            onClick={() => setPageIndex(prev => Math.min(totalPages - 1, prev + 1))}
                            disabled={pageIndex >= totalPages - 1}
                            className="p-2 rounded-xl hover:bg-gray-2 dark:hover:bg-dark-2 disabled:opacity-30 disabled:cursor-not-allowed transition-all text-dark-2 dark:text-meta-5"
                        >
                            <ChevronRight className="h-5 w-5" />
                        </button>
                        <button
                            onClick={() => setPageIndex(totalPages - 1)}
                            disabled={pageIndex >= totalPages - 1}
                            className="p-2 rounded-xl hover:bg-gray-2 dark:hover:bg-dark-2 disabled:opacity-30 disabled:cursor-not-allowed transition-all text-dark-2 dark:text-meta-5"
                        >
                            <ChevronsRight className="h-5 w-5" />
                        </button>
                    </div>
                </div>
            </div>



            {/* Order Items Modal */}
            <OrderItemModal
                order={selectedOrder}
                isOpen={isViewModalOpen}
                onClose={() => {
                    setIsViewModalOpen(false)
                    setSelectedOrder(null)
                }}
                onStatusUpdate={fetchOrders}
            />

            {/* Status Update Modal */}
            {isStatusModalOpen && (
                <div
                    className="fixed inset-0 z-[9999] flex items-center justify-center bg-dark-6/60 backdrop-blur-sm animate-in fade-in duration-300"
                    onClick={(e) => e.target === e.currentTarget && setIsStatusModalOpen(false)}
                >
                    <div className="bg-white dark:bg-gray-dark rounded-2xl shadow-2xl w-full max-w-md mx-4 transform transition-all animate-in zoom-in duration-200">
                        {/* Header */}
                        <div className="flex items-center justify-between px-7 py-5 border-b border-stroke dark:border-stroke-dark">
                            <div className="flex items-center gap-4">
                                <div className="p-2.5 bg-yellow-light-6 dark:bg-yellow/10 rounded-xl">
                                    <Edit className="h-6 w-6 text-yellow" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold text-dark-2 dark:text-white tracking-tight">
                                        Update Status
                                    </h3>
                                    <p className="text-sm text-slate-400 font-medium mt-0.5">
                                        Order <span className="text-blue font-bold uppercase">#{selectedOrder?.orderCode}</span>
                                    </p>
                                </div>
                            </div>
                            <button
                                onClick={() => setIsStatusModalOpen(false)}
                                className="p-2 rounded-xl text-slate-400 hover:text-dark-2 dark:hover:text-white hover:bg-gray-2 dark:hover:bg-dark-3 transition-all"
                            >
                                <X className="h-5 w-5" />
                            </button>
                        </div>

                        {/* Content */}
                        <div className="p-7">
                            <div className="grid grid-cols-1 gap-3">
                                {selectedOrder && (validTransitions[selectedOrder.status as keyof typeof validTransitions] || []).map((status) => (
                                    <button
                                        key={status}
                                        onClick={() => setPendingStatus(status as OrderStatus)}
                                        className={`py-3.5 px-5 rounded-xl font-bold text-sm transition-all border-2 flex items-center justify-between group ${pendingStatus === status
                                            ? "border-blue bg-blue-light-5 text-blue dark:bg-blue-dark/20"
                                            : "border-transparent bg-gray-1 dark:bg-dark-2 text-slate-500 hover:bg-gray-2 dark:hover:bg-dark-3 hover:border-slate-200 dark:hover:border-dark-4"
                                            }`}
                                    >
                                        <span>{status}</span>
                                        {pendingStatus === status && (
                                            <div className="w-2 h-2 rounded-full bg-blue animate-pulse"></div>
                                        )}
                                    </button>
                                ))}
                                {selectedOrder && (validTransitions[selectedOrder.status as keyof typeof validTransitions] || []).length === 0 && (
                                    <div className="text-center py-4 text-red-light font-medium italic">
                                        No valid status transitions available for {selectedOrder.status}
                                    </div>
                                )}
                            </div>

                            <button
                                onClick={() => pendingStatus && handleUpdateStatus(pendingStatus) && setIsStatusModalOpen(false)}
                                disabled={!pendingStatus || pendingStatus === selectedOrder?.status}
                                className="w-full mt-8 py-4 px-6 rounded-xl font-bold text-white bg-blue hover:bg-blue-dark shadow-lg shadow-blue-200 dark:shadow-none transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:scale-100"
                            >
                                Update Status
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
