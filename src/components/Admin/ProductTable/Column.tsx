"use client"

import { ColumnDef } from "@tanstack/react-table"
import dayjs from "dayjs"
import { Edit, Trash2, PlusCircle, ArrowUpDown, ArrowUp, ArrowDown } from "lucide-react"

// Type chuẩn cho product
export type ProductVariant = {
    id: number
    price: number
    stockQuantity: number
    isDefault: boolean
    color: {
        name: string
        hexCode: string
    }
    image: string
}

export type Product = {
    id: number
    name: string
    brand: string
    category: string
    thumbnail: string
    created: string
    productVariants: ProductVariant[]
}

// Columns
export const columns: ColumnDef<Product>[] = [
    {
        accessorKey: "name",
        header: "Product",
        cell: ({ row }) => {
            const product = row.original
            return (
                <div className="flex items-center gap-4 group">
                    <div className="relative">
                        <img
                            src={product.thumbnail || null}
                            alt={product.name}
                            className="w-12 h-12 rounded-xl object-cover shadow-sm transition-transform duration-300 group-hover:scale-110"
                        />
                    </div>
                    <div className="flex flex-col">
                        <span className="font-bold text-dark-2 dark:text-meta-5 leading-tight group-hover:text-indigo-600 transition-colors">{product.name}</span>
                        <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mt-1">ID: {product.id}</span>
                    </div>
                </div>
            )
        },
    },
    {
        accessorKey: "productType",
        header: () => <div className="text-center">Category</div>,
        cell: ({ row }) => (
            <div className="flex justify-center">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-dark-2 dark:bg-indigo-900/30 dark:text-meta-5 uppercase tracking-wider">
                    {row.getValue("productType") || "N/A"}
                </span>
            </div>
        )
    },
    {
        accessorKey: "brand",
        header: () => <div className="text-center">Brand</div>,
        cell: ({ row }) => <div className="text-center font-medium text-dark-2 dark:text-meta-5">{row.getValue("brand")}</div>
    },
    {
        id: "price",
        header: ({ column }) => (
            <div className="flex justify-center">
                <button
                    className="flex items-center gap-2 hover:text-indigo-600 transition-colors"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Price
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
            const product = row.original
            const defaultVariant = product.productVariants?.find(v => v.isDefault) || product.productVariants?.[0]
            const price = defaultVariant?.price || 0
            return (
                <div className="flex flex-col items-center">
                    <span className="text-sm font-medium text-dark-2 dark:text-meta-5">${price.toLocaleString()}</span>
                    <span className="text-[10px] font-medium text-dark-2 dark:text-meta-5 uppercase">Base Price</span>
                </div>
            )
        },
    },
    {
        id: "totalStock",
        header: ({ column }) => (
            <div className="flex justify-center">
                <button
                    className="flex items-center gap-2 hover:text-indigo-600 transition-colors"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Stock
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
            const product = row.original
            const totalStock = product.productVariants?.reduce((acc, v) => acc + v.stockQuantity, 0) || 0
            const isOutOfStock = totalStock <= 1

            return (
                <div className="flex items-center justify-center gap-2">
                    <div className={`w-1.5 h-1.5 rounded-full ${isOutOfStock ? "bg-red-500 animate-pulse" : "bg-emerald-500"}`}></div>
                    <span className={`text-xs font-bold ${isOutOfStock ? "text-red-600" : "text-dark-2 dark:text-meta-5"}`}>
                        {isOutOfStock ? (
                            <span className="font-medium text-red-light tracking-wider">Out of Stock</span>
                        ) : (
                            <>
                                {totalStock} <span className="text-[10px] text-green-light font-medium uppercase ml-0.5">in stock</span>
                            </>
                        )}
                    </span>
                </div>
            )
        },
    },
    {
        accessorKey: "created",
        header: ({ column }) => (
            <div className="flex justify-center">
                <button
                    className="flex items-center gap-2 hover:text-indigo-600 transition-colors"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Created
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
            const date = row.getValue("created") as string
            return (
                <div className="flex flex-col items-center">
                    <span className="text-xs font-bold text-dark-2 dark:text-meta-5">{dayjs(date).format("MMM DD, YYYY")}</span>
                    <span className="text-[10px] font-bold text-slate-400 uppercase">{dayjs(date).format("hh:mm A")}</span>
                </div>
            )
        },
    },
    {
        id: "actions",
        header: () => <div className="text-center">Actions</div>,
        cell: ({ row, table }) => {
            const product = row.original
            const { onEdit, onDelete, onVariantClick } = table.options.meta as any

            return (
                <div className="flex gap-1 justify-center">
                    <button
                        onClick={() => onVariantClick?.(product)}
                        className="p-2.5 text-slate-400 hover:text-emerald-500 hover:bg-emerald-50 rounded-xl transition-all duration-200 active:scale-90"
                        title="Manage variants"
                    >
                        <PlusCircle className="h-4.5 w-4.5 text-green-light dark:text-meta-5" />
                    </button>
                    <button
                        onClick={() => onEdit?.(product)}
                        className="p-2.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all duration-200 active:scale-90"
                        title="Edit product"
                    >
                        <Edit className="h-4.5 w-4.5 text-blue-light dark:text-meta-5" />
                    </button>
                    <button
                        onClick={() => onDelete?.(product)}
                        className="p-2.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all duration-200 active:scale-90"
                        title="Delete product"
                    >
                        <Trash2 className="h-4.5 w-4.5 text-red-light dark:text-meta-5" />
                    </button>
                </div>
            )
        },
    },
]