"use client"

import { useEffect, useState, useRef, useCallback } from "react"
import {
    ColumnDef,
    flexRender,
    getCoreRowModel,
    getSortedRowModel,
    SortingState,
    useReactTable,
} from "@tanstack/react-table"
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, Trash2, Edit, X, Plus, ArrowUpDown, ArrowUp, ArrowDown } from "lucide-react"
import { createPortal } from "react-dom"
import { toast } from "react-hot-toast"
import AddVariantsModal, { EditVariantsModal } from "./AddVariantsModal"
import { EditProductModal } from "./AddProductModal"

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { getAllProducts, searchProducts, deleteProduct, updateProduct, deleteVariant } from "@/api/adminApi"

interface DataTableProps<TData, TValue> {
    columns: ColumnDef<TData, TValue>[]
    keyword?: string
}

export function DataTable<TData, TValue>({
    columns,
    keyword,
}: DataTableProps<TData, TValue>) {
    const [data, setData] = useState<TData[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [mounted, setMounted] = useState(false)

    useEffect(() => {
        setMounted(true)
    }, [])

    // Pagination state
    const [pageIndex, setPageIndex] = useState(0)
    const [pageSize, setPageSize] = useState(10)
    const [totalPages, setTotalPages] = useState(0)
    const [totalElements, setTotalElements] = useState(0)
    const [sorting, setSorting] = useState<SortingState>([])

    // Modal state
    const [selectedProduct, setSelectedProduct] = useState<any>(null)
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
    const [isEditModalOpen, setIsEditModalOpen] = useState(false)
    const [isVariantModalOpen, setIsVariantModalOpen] = useState(false)
    const [isAddVariantModalOpen, setIsAddVariantModalOpen] = useState(false)
    const [isEditVariantModalOpen, setIsEditVariantModalOpen] = useState(false)
    const [selectedVariant, setSelectedVariant] = useState<any>(null)

    const fetchProducts = useCallback(async () => {
        setIsLoading(true)
        try {
            let result;
            if (keyword && keyword.trim() !== "") {
                result = await searchProducts(keyword, pageIndex, pageSize);
            } else {
                const sortParam = sorting.length > 0 ? {
                    field: sorting[0].id,
                    direction: sorting[0].desc ? 'desc' as const : 'asc' as const
                } : undefined;

                result = await getAllProducts({
                    page: pageIndex,
                    size: pageSize,
                    sort: sortParam
                })
            }
            setData(result.content as TData[])
            setTotalPages(result.page?.totalPages || 0)
            setTotalElements(result.page?.totalElements || 0)
        } catch (error) {
            console.error("Error loading products:", error)
        } finally {
            setIsLoading(false)
        }
    }, [pageIndex, pageSize, sorting, keyword])

    useEffect(() => {
        fetchProducts()
    }, [fetchProducts])

    // Keep selectedProduct in sync with the latest data after a refresh
    useEffect(() => {
        if (selectedProduct) {
            const updatedProduct = (data as any[]).find(p => p.id === selectedProduct.id)
            if (updatedProduct) {
                setSelectedProduct(updatedProduct)
            }
        }
    }, [data])

    const handleDelete = async () => {
        if (!selectedProduct) return
        try {
            await deleteProduct(selectedProduct.id)
            setIsDeleteModalOpen(false)
            setSelectedProduct(null)
            toast.success("Product deleted successfully")
            fetchProducts() // Refresh data
        } catch (error) {
            toast.error("Failed to delete product")
        }
    }

    const handleDeleteVariant = async (variantId: number) => {
        if (!window.confirm("Are you sure you want to delete this variant?")) return
        try {
            await deleteVariant(variantId)
            toast.success("Variant deleted successfully!")
            fetchProducts() // Refresh the product list which contains variants
        } catch (error: any) {
            console.error("Error deleting variant:", error)
            toast.error(error?.response?.data || "Failed to delete variant")
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
            onEdit: (product: any) => {
                setSelectedProduct(product)
                setIsEditModalOpen(true)
            },
            onDelete: (product: any) => {
                setSelectedProduct(product)
                setIsDeleteModalOpen(true)
            },
            onVariantClick: (product: any) => {
                setSelectedProduct(product)
                setIsVariantModalOpen(true)
            },
        },
    })

    const handleUpdateProduct = async (productData: any) => {
        try {
            if (!selectedProduct) return;
            const defaultVariantId = selectedProduct?.productVariants.find((v: any) => v.isDefault)?.id || selectedProduct?.productVariants[0]?.id;

            await updateProduct(defaultVariantId, productData);

            toast.success("Product updated successfully")
            setIsEditModalOpen(false)
            setSelectedProduct(null)
            fetchProducts()
        } catch (error: any) {
            console.error("Error updating product:", error)
            toast.error(error?.response?.data || "Failed to update product")
        }
    }

    return (
        <div className="space-y-4">
            <div className="overflow-hidden rounded-md bg-white dark:bg-dark-2 shadow-sm transition-colors duration-300">
                <Table>
                    <TableHeader>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id} className="bg-gray-50/50 dark:bg-dark-3/50 border-b border-gray-100 dark:border-dark-3">
                                {headerGroup.headers.map((header) => (
                                    <TableHead key={header.id} className="text-dark-2 dark:text-meta-5 font-bold h-12 text-base">
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
                                <TableCell colSpan={columns.length} className="h-24 text-center text-dark-2 dark:text-meta-5">
                                    <div className="flex items-center justify-center gap-2">
                                        <div className="w-4 h-4 border-2 border-indigo-600 dark:border-indigo-400 border-t-transparent rounded-full animate-spin"></div>
                                        Loading products...
                                    </div>
                                </TableCell>
                            </TableRow>
                        ) : table.getRowModel().rows?.length ? (
                            table.getRowModel().rows.map((row) => (
                                <TableRow
                                    key={row.id}
                                    data-state={row.getIsSelected() && "selected"}
                                    className="hover:bg-dark-5 dark:hover:bg-dark-3 transition-colors dark:border-dark-3"
                                >
                                    {row.getVisibleCells().map((cell) => (
                                        <TableCell key={cell.id} className="py-3">
                                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={columns.length} className="h-24 text-center text-dark-2 dark:text-meta-5 font-medium">
                                    No products found.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>

            {/* Pagination Controls */}
            <div className="flex items-center justify-between px-2 py-1">
                <div className="text-sm text-dark dark:text-meta-5 font-medium">
                    Showing {data.length} of {totalElements} products
                </div>
                <div className="flex items-center space-x-2">
                    <div className="flex items-center space-x-2 mr-4">
                        <span className="text-sm font-medium text-dark-2 dark:text-meta-5">Rows per page</span>
                        <select
                            value={pageSize}
                            onChange={(e) => {
                                setPageSize(Number(e.target.value))
                                setPageIndex(0)
                            }}
                            className="h-8 w-16 rounded bg-white px-1 text-sm text-dark-2 dark:text-meta-5 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                        >
                            {[10, 20, 30, 40, 50].map((size) => (
                                <option key={size} value={size}>
                                    {size}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="flex items-center space-x-1">
                        <button
                            onClick={() => setPageIndex(0)}
                            disabled={pageIndex === 0}
                            className="p-1 rounded hover:bg-gray-100 dark:hover:bg-dark-4 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                        >
                            <ChevronsLeft className="h-5 w-5 text-dark-2 dark:text-meta-5" />
                        </button>
                        <button
                            onClick={() => setPageIndex(prev => Math.max(0, prev - 1))}
                            disabled={pageIndex === 0}
                            className="p-1 rounded hover:bg-gray-100 dark:hover:bg-dark-4 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                        >
                            <ChevronLeft className="h-5 w-5 text-dark-2 dark:text-meta-5" />
                        </button>
                        <span className="text-sm font-semibold text-dark-2 dark:text-meta-5 px-2">
                            Page {pageIndex + 1} of {totalPages || 1}
                        </span>
                        <button
                            onClick={() => setPageIndex(prev => Math.min(totalPages - 1, prev + 1))}
                            disabled={pageIndex >= totalPages - 1}
                            className="p-1 rounded hover:bg-gray-100 dark:hover:bg-dark-4 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                        >
                            <ChevronRight className="h-5 w-5 text-dark-2 dark:text-meta-5" />
                        </button>
                        <button
                            onClick={() => setPageIndex(totalPages - 1)}
                            disabled={pageIndex >= totalPages - 1}
                            className="p-1 rounded hover:bg-gray-100 dark:hover:bg-dark-4 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                        >
                            <ChevronsRight className="h-5 w-5 text-dark-2 dark:text-meta-5" />
                        </button>
                    </div>
                </div>
            </div>

            {/* Delete Confirmation Modal */}
            {isDeleteModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
                    <div className="bg-white dark:bg-dark-3 rounded-xl shadow-xl w-full max-w-md p-6 transform transition-all animate-in zoom-in duration-200">
                        <div className="flex items-center gap-4 text-red-600 mb-4">
                            <div className="bg-red-100 p-3 rounded-full">
                                <Trash2 className="h-6 w-6 text-red" />
                            </div>
                            <h3 className="text-xl text-red-light font-bold">Delete Product</h3>
                        </div>
                        <p className="text-gray-600 dark:text-meta-4 mb-6 font-medium">
                            Are you sure you want to delete <span className="text-dark-2 dark:text-meta-5 font-bold">"{selectedProduct?.name}"</span>?
                            This action cannot be undone.
                        </p>
                        <div className="flex justify-end gap-3">
                            <button
                                onClick={() => setIsDeleteModalOpen(false)}
                                className="px-4 py-2 text-sm font-semibold text-green-dark bg-green-light-6 hover:bg-gray-200 rounded-lg transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleDelete}
                                className="px-4 py-2 text-sm font-semibold text-red-dark bg-red-light-5 hover:bg-red-700 rounded-lg shadow-sm transition-colors"
                            >
                                Delete Product
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Edit Product Modal */}
            {isEditModalOpen && mounted && createPortal(
                <EditProductModal
                    isOpen={isEditModalOpen}
                    onClose={() => {
                        setIsEditModalOpen(false)
                        setSelectedProduct(null)
                    }}
                    onUpdate={handleUpdateProduct}
                    product={selectedProduct}
                />,
                document.body
            )}



            {isVariantModalOpen && mounted && createPortal(
                <div
                    className="fixed inset-0 z-50 flex justify-end bg-dark-6/60 backdrop-blur-[2px] transition-all duration-300"
                    onClick={() => setIsVariantModalOpen(false)}
                >
                    <div
                        className="bg-white dark:bg-dark-2 w-full max-w-[550px] h-full shadow-2xl p-0 flex flex-col transform transition-transform duration-500 animate-in slide-in-from-right"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Header */}
                        <div className="p-6 border-b border-gray-100 dark:border-dark-3 flex items-center justify-between bg-white dark:bg-dark-2 sticky top-0 z-10">
                            <div>
                                <h3 className="text-xl font-bold text-dark-2 dark:text-meta-5">
                                    Manage Variants
                                </h3>
                                <p className="text-sm text-slate-400 mt-1">{selectedProduct?.name}</p>
                            </div>
                            <div className="flex items-center gap-3">
                                <button
                                    onClick={() => setIsVariantModalOpen(false)}
                                    className="p-2 hover:bg-gray-100 dark:hover:bg-dark-4 rounded-xl transition-all text-gray-500 group"
                                >
                                    <X className="h-6 w-6 group-hover:rotate-90 transition-transform duration-300" />
                                </button>
                            </div>
                        </div>

                        {/* Content */}
                        <div className="flex-1 overflow-y-auto p-6 space-y-6">
                            <div className="grid gap-4">
                                {selectedProduct?.productVariants?.map((variant: any) => (
                                    <div
                                        key={variant.id}
                                        className="p-4 rounded-2xl border border-gray-100 dark:border-dark-3 bg-gray-50/50 dark:bg-dark-3/30 hover:border-indigo-200 dark:hover:border-indigo-900 transition-all group"
                                    >
                                        <div className="flex gap-4">
                                            <div className="relative h-20 w-20 flex-shrink-0">
                                                <img
                                                    src={variant.image || null}
                                                    alt={variant.color.name || "Product Image"}
                                                    className="h-full w-full rounded-xl object-cover shadow-sm"
                                                />
                                                <div
                                                    className="absolute -top-1 -right-1 w-5 h-5 rounded-full border-2 border-white dark:border-dark-3 shadow-sm"
                                                    style={{ backgroundColor: variant.color.hexCode }}
                                                    title={variant.color.name}
                                                ></div>
                                            </div>

                                            <div className="flex-1 min-w-0">
                                                <div className="flex justify-between items-start mb-1">
                                                    <div>
                                                        <h4 className="text-sm font-bold text-dark-2 dark:text-meta-5 flex items-center gap-2">
                                                            {variant.color.name}
                                                            {variant.isDefault && (
                                                                <span className="text-[10px] bg-indigo-100 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-400 px-1.5 py-0.5 rounded-md font-bold uppercase">Default</span>
                                                            )}
                                                        </h4>
                                                        <p className="text-xs text-slate-400 mt-0.5 font-medium">SKU: VAR-{variant.id}</p>
                                                    </div>
                                                    <div className="text-right">
                                                        <p className="text-sm font-bold text-dark-2 dark:text-meta-5">${variant.price.toLocaleString()}</p>
                                                        <div className="mt-1">
                                                            {variant.stockQuantity > 0 ? (
                                                                <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/20 px-2 py-0.5 rounded-full uppercase tracking-wider">
                                                                    {variant.stockQuantity} In Stock
                                                                </span>
                                                            ) : (
                                                                <span className="text-[10px] font-bold text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 px-2 py-0.5 rounded-full uppercase tracking-wider">
                                                                    Out of Stock
                                                                </span>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="flex justify-end items-center gap-4 mt-3">
                                                    <button
                                                        onClick={() => {
                                                            setSelectedVariant(variant)
                                                            setIsEditVariantModalOpen(true)
                                                        }}
                                                        className="text-[11px] font-bold text-green-light dark:text-indigo-400 hover:underline flex items-center gap-1 uppercase tracking-wider"
                                                    >
                                                        <Edit className="h-3 w-3" />
                                                        Edit
                                                    </button>
                                                    <button
                                                        onClick={() => handleDeleteVariant(variant.id)}
                                                        className="text-[11px] font-bold text-red-light dark:text-red-400 hover:underline flex items-center gap-1 uppercase tracking-wider"
                                                    >
                                                        <Trash2 className="h-3 w-3" />
                                                        Delete
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Footer */}
                        <div className="p-6 border-t border-gray-2 dark:border-dark-3 bg-gray-50 dark:bg-dark-2">
                            <button
                                onClick={() => setIsAddVariantModalOpen(true)}
                                className="w-full py-4 text-sm font-bold text-dark-2 dark:text-meta-5 dark:bg-dark-3 hover:bg-indigo-700 rounded-xl shadow-lg shadow-indigo-200 dark:shadow-none transition-all active:scale-[0.98] flex items-center justify-center gap-2"
                            >
                                <Plus className="h-5 w-5 text-teal-dark" />
                                Add New Variant
                            </button>
                        </div>
                    </div>
                </div>,
                document.body
            )}

            {isAddVariantModalOpen && mounted && createPortal(
                <AddVariantsModal
                    isOpen={isAddVariantModalOpen}
                    onClose={() => setIsAddVariantModalOpen(false)}
                    onSuccess={fetchProducts}
                    productId={selectedProduct?.id}
                    productType={selectedProduct?.productType}
                    productName={selectedProduct?.name}
                />,
                document.body
            )}

            {isEditVariantModalOpen && mounted && createPortal(
                <EditVariantsModal
                    isOpen={isEditVariantModalOpen}
                    onClose={() => setIsEditVariantModalOpen(false)}
                    onSuccess={fetchProducts}
                    variant={selectedVariant}
                    productType={selectedProduct?.productType}
                    productName={selectedProduct?.name}
                />,
                document.body
            )}
        </div>
    )
}

