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
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, Ticket } from "lucide-react"
import { toast } from "react-hot-toast"
import {
    getAllVouchers,
    VoucherAdminResponse,
    VoucherRequest,
    createVoucher,
    updateVoucher,
    deleteVoucher,
} from "@/api/adminApi"

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"

import VoucherFormModal from "./VoucherFormModal"
import ConfirmDeleteModal from "../ConfirmDeleteModal"

interface DataTableProps<TData, TValue> {
    columns: ColumnDef<TData, TValue>[]
    addModalOpen?: boolean
    setAddModalOpen?: (open: boolean) => void
    searchKeyword?: string
    status?: string
}

export function VoucherDataTable<TData, TValue>({
    columns,
    addModalOpen,
    setAddModalOpen,
    searchKeyword = "",
    status,
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
    const [editingVoucher, setEditingVoucher] = useState<VoucherAdminResponse | null>(null)
    const [internalEditOpen, setInternalEditOpen] = useState(false)
    const [isSubmitting, setIsSubmitting] = useState(false)

    const [isDeleteOpen, setIsDeleteOpen] = useState(false)
    const [deletingVoucher, setDeletingVoucher] = useState<VoucherAdminResponse | null>(null)
    const [isDeleting, setIsDeleting] = useState(false)

    // Form modal is open if parent triggered add OR internal edit is triggered
    const isFormOpen = (addModalOpen ?? false) || internalEditOpen

    const closeFormModal = () => {
        setAddModalOpen?.(false)
        setInternalEditOpen(false)
        setEditingVoucher(null)
    }

    const fetchVouchers = useCallback(async () => {
        setIsLoading(true)
        try {
            const sortParam = sorting.length > 0 ? {
                field: sorting[0].id,
                direction: sorting[0].desc ? 'desc' as const : 'asc' as const
            } : undefined;

            const result = await getAllVouchers({
                page: pageIndex,
                size: pageSize,
                sort: sortParam,
                keyword: searchKeyword,
                status: status,
            })

            setData(result.content as TData[])
            setTotalPages(result.page?.totalPages || 0)
            setTotalElements(result.page?.totalElements || 0)
        } catch (error) {
            console.error("Error loading vouchers:", error)
            toast.error("Failed to load vouchers")
        } finally {
            setIsLoading(false)
        }
    }, [pageIndex, pageSize, sorting, searchKeyword, status])

    useEffect(() => {
        setPageIndex(0)
    }, [searchKeyword, status])

    useEffect(() => {
        fetchVouchers()
    }, [fetchVouchers])

    // Handlers
    const handleOpenEdit = (voucher: VoucherAdminResponse) => {
        setEditingVoucher(voucher)
        setInternalEditOpen(true)
    }

    const handleOpenDelete = (voucher: VoucherAdminResponse) => {
        setDeletingVoucher(voucher)
        setIsDeleteOpen(true)
    }

    const handleFormSubmit = async (formData: VoucherRequest) => {
        setIsSubmitting(true)
        try {
            if (editingVoucher) {
                await updateVoucher(editingVoucher.id, formData)
                toast.success(`Voucher "${formData.code}" updated successfully`)
            } else {
                await createVoucher(formData)
                toast.success(`Voucher "${formData.code}" created successfully`)
            }
            closeFormModal()
            fetchVouchers()
        } catch (error) {
            toast.error(editingVoucher ? "Failed to update voucher" : "Failed to create voucher")
        } finally {
            setIsSubmitting(false)
        }
    }

    const handleDeleteConfirm = async () => {
        if (!deletingVoucher) return
        setIsDeleting(true)
        try {
            await deleteVoucher(deletingVoucher.id)
            toast.success(`Voucher "${deletingVoucher.code}" deleted successfully`)
            setIsDeleteOpen(false)
            setDeletingVoucher(null)
            fetchVouchers()
        } catch (error) {
            toast.error("Failed to delete voucher")
        } finally {
            setIsDeleting(false)
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
            onEdit: (voucher: VoucherAdminResponse) => {
                handleOpenEdit(voucher)
            },
            onDelete: (voucher: VoucherAdminResponse) => {
                handleOpenDelete(voucher)
            },
            onAdd: () => {
                setAddModalOpen?.(true)
            },
        },
    })

    return (
        <div className="space-y-4">
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
                                        <span className="text-sm font-bold text-slate-400 uppercase tracking-widest">Loading vouchers...</span>
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
                                        <Ticket className="h-10 w-10 text-slate-400" />
                                        <span className="text-sm font-bold text-slate-400 uppercase tracking-wider">No vouchers found.</span>
                                    </div>
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-2 py-2">
                <div className="text-sm font-bold text-slate-500 dark:text-meta-5">
                    Showing <span className="text-blue dark:text-blue-light">{data.length}</span> of <span className="text-dark-2 dark:text-meta-5">{totalElements}</span> vouchers
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

            {/* Modals */}
            <VoucherFormModal
                isOpen={isFormOpen}
                onClose={closeFormModal}
                onSubmit={handleFormSubmit}
                voucher={editingVoucher}
                isSubmitting={isSubmitting}
            />

            <ConfirmDeleteModal
                isOpen={isDeleteOpen}
                onClose={() => {
                    setIsDeleteOpen(false)
                    setDeletingVoucher(null)
                }}
                onConfirm={handleDeleteConfirm}
                isDeleting={isDeleting}
                title="Delete Voucher"
                description={`Are you sure you want to delete the voucher "${deletingVoucher?.code}"? This will remove it permanently and any unused codes will be invalidated.`}
            />
        </div>
    )
}
