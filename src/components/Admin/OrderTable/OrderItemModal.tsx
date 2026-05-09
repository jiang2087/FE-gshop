"use client"

import { useEffect, useState } from "react"
import { X, Package, ShoppingCart, Tag, Hash, DollarSign, Layers, ChevronDown, AlertTriangle, BadgePercent } from "lucide-react"
import { getOrderItems, OrderItemResponse, OrderStatus, updateOrderStatus, getDiscountOrder } from "@/api/adminApi"
import { OrderAdminResponse } from "./columns"
import Image from "next/image"

interface OrderItemModalProps {
    order: OrderAdminResponse | null
    isOpen: boolean
    onClose: () => void
    onStatusUpdate?: () => void
}

const validTransitions: Record<string, OrderStatus[]> = {
    PENDING: ["PROCESSING", "CANCELLED"],
    PROCESSING: ["SHIPPED", "CANCELLED"],
    SHIPPED: ["COMPLETED"],
    COMPLETED: [],
    CANCELLED: [],
};

const statusConfig: Record<OrderStatus, { label: string; className: string; dot: string; text: string }> = {
    PENDING: {
        label: "Pending",
        className: "bg-yellow-light-6 dark:bg-yellow-dark/10",
        text: "text-yellow-dark dark:text-yellow-light",
        dot: "bg-yellow"
    },
    PROCESSING: {
        label: "Processing",
        className: "bg-blue-light-5 dark:bg-blue-dark/20",
        text: "text-blue dark:text-blue-light",
        dot: "bg-blue"
    },
    SHIPPED: {
        label: "Shipped",
        className: "bg-primary/10 dark:bg-primary/20",
        text: "text-primary dark:text-primary",
        dot: "bg-primary"
    },
    COMPLETED: {
        label: "Completed",
        className: "bg-green-light-6 dark:bg-green-dark/10",
        text: "text-green dark:text-green-light",
        dot: "bg-green"
    },
    CANCELLED: {
        label: "Cancelled",
        className: "bg-red-light-6 dark:bg-red-dark/10",
        text: "text-red dark:text-red-light",
        dot: "bg-red"
    }
}

export default function OrderItemModal({ order, isOpen, onClose, onStatusUpdate }: OrderItemModalProps) {
    const [items, setItems] = useState<OrderItemResponse[]>([])
    const [isLoading, setIsLoading] = useState(false)
    const [isUpdatingStatus, setIsUpdatingStatus] = useState(false)
    const [showStatusDropdown, setShowStatusDropdown] = useState(false)
    const [confirmingStatus, setConfirmingStatus] = useState<OrderStatus | null>(null)
    const [discountValue, setDiscountValue] = useState<number>(0)

    useEffect(() => {
        if (!isOpen || !order) return

        const fetchData = async () => {
            setIsLoading(true)
            try {
                const [itemsData, discountsData] = await Promise.all([
                    getOrderItems(order.id),
                    getDiscountOrder(order.id)
                ])
                setItems(itemsData)

                setDiscountValue(discountsData || 0)
            } catch (error) {
                console.error("Failed to load order data:", error)
                setItems([])
            } finally {
                setIsLoading(false)
            }
        }

        fetchData()
        setShowStatusDropdown(false)
        setConfirmingStatus(null)
    }, [isOpen, order])

    const handleStatusChange = async (newStatus: OrderStatus) => {
        if (!order || isUpdatingStatus) return

        setIsUpdatingStatus(true)
        try {
            await updateOrderStatus(order.id, newStatus)
            setShowStatusDropdown(false)
            setConfirmingStatus(null)
            onStatusUpdate?.()
        } catch (error) {
            console.error("Failed to update status:", error)
        } finally {
            setIsUpdatingStatus(false)
        }
    }

    if (!isOpen || !order) return null

    const formatCurrency = (value: number) =>
        new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(value)

    return (
        <div
            className="fixed inset-0 z-[9999] flex items-center justify-center bg-dark-6/60 backdrop-blur-sm animate-in fade-in duration-300"
            onClick={(e) => e.target === e.currentTarget && onClose()}
        >
            <div className="bg-white dark:bg-gray-dark rounded-2xl shadow-2xl w-full max-w-3xl mx-4 max-h-[90vh] flex flex-col animate-in zoom-in-95 duration-200">
                {/* Header */}
                <div className="flex items-center justify-between px-7 py-5 border-b border-stroke dark:border-stroke-dark">
                    <div className="flex items-center gap-4">
                        <div className="p-2.5 bg-blue-light-5 dark:bg-blue-dark/20 rounded-xl">
                            <ShoppingCart className="h-6 w-6 text-blue" />
                        </div>
                        <div>
                            <h2 className="text-lg font-bold text-dark-2 dark:text-white tracking-tight">
                                Order Details
                            </h2>
                            <p className="text-sm text-slate-400 font-medium mt-0.5">
                                <span className="text-blue dark:text-blue-light font-bold uppercase">
                                    #{order.orderCode}
                                </span>
                                &nbsp;·&nbsp;{order.customerName}
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        {/* Status Selector */}
                        <div className="relative">
                            <button
                                onClick={() => setShowStatusDropdown(!showStatusDropdown)}
                                disabled={isUpdatingStatus || validTransitions[order.status]?.length === 0}
                                className={`flex items-center gap-2.5 px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all border border-transparent hover:border-stroke dark:hover:border-stroke-dark active:scale-95 disabled:opacity-50 disabled:scale-100 ${statusConfig[order.status].className} ${statusConfig[order.status].text}`}
                            >
                                <span className={`w-2 h-2 rounded-full ${statusConfig[order.status].dot}`}></span>
                                {statusConfig[order.status].label}
                                {validTransitions[order.status]?.length > 0 && (
                                    <ChevronDown className={`h-4 w-4 transition-transform duration-300 ${showStatusDropdown ? "rotate-180" : ""}`} />
                                )}
                            </button>

                            {showStatusDropdown && (
                                <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-dark-2 rounded-xl shadow-2xl border border-stroke dark:border-stroke-dark overflow-hidden z-[100] animate-in slide-in-from-top-2 duration-200">
                                    <div className="p-1.5 space-y-1">
                                        <div className="px-3 py-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest border-b border-stroke dark:border-stroke-dark mb-1">
                                            Transition to:
                                        </div>
                                        {validTransitions[order.status].map((status) => (
                                            <button
                                                key={status}
                                                onClick={() => {
                                                    setConfirmingStatus(status)
                                                    setShowStatusDropdown(false)
                                                }}
                                                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-gray-1 dark:hover:bg-dark-3 transition-colors text-left group"
                                            >
                                                <span className={`w-2 h-2 rounded-full ${statusConfig[status].dot}`}></span>
                                                <span className={`text-xs font-bold uppercase tracking-wide ${statusConfig[status].text}`}>
                                                    {statusConfig[status].label}
                                                </span>
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        <button
                            onClick={onClose}
                            className="p-2 rounded-xl text-slate-400 hover:text-dark-2 dark:hover:text-white hover:bg-gray-2 dark:hover:bg-dark-3 transition-all active:scale-90"
                            title="Close"
                        >
                            <X className="h-5 w-5" />
                        </button>
                    </div>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto px-7 py-5">
                    {isLoading ? (
                        <div className="flex flex-col items-center justify-center py-16 gap-3">
                            <div className="w-9 h-9 border-[3px] border-blue dark:border-blue-light border-t-transparent rounded-full animate-spin" />
                            <span className="text-sm font-bold text-slate-400 uppercase tracking-widest">
                                Loading items...
                            </span>
                        </div>
                    ) : items.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-16 gap-3 opacity-40">
                            <Package className="h-12 w-12 text-slate-400" />
                            <span className="text-sm font-bold text-slate-400 uppercase tracking-wider">
                                No items found
                            </span>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {/* Column Headers */}
                            <div className="grid grid-cols-[2fr_1fr_1fr_1fr] gap-4 px-4 py-2 rounded-xl bg-gray-1 dark:bg-dark-2/50">
                                <span className="text-xs font-bold text-dark dark:text-stroke uppercase tracking-wider flex items-center gap-1.5">
                                    <Package className="h-3.5 w-3.5" /> Product
                                </span>
                                <span className="text-xs font-bold text-dark dark:text-stroke uppercase tracking-wider text-center flex items-center justify-center gap-1.5">
                                    <Hash className="h-3.5 w-3.5" /> Qty
                                </span>
                                <span className="text-xs font-bold text-dark dark:text-stroke uppercase tracking-wider text-center flex items-center justify-center gap-1.5">
                                    <DollarSign className="h-3.5 w-3.5" /> Price
                                </span>
                                <span className="text-xs font-bold text-dark dark:text-stroke uppercase tracking-wider text-right flex items-center justify-end gap-1.5">
                                    <Layers className="h-3.5 w-3.5" /> Subtotal
                                </span>
                            </div>

                            {/* Item Rows */}
                            {items.map((item) => (
                                <div
                                    key={item.id}
                                    className="grid grid-cols-[2fr_1fr_1fr_1fr] gap-4 items-center px-4 py-3 rounded-xl border border-stroke dark:border-stroke-dark hover:bg-gray-2 dark:hover:bg-dark-3 transition-all duration-200"
                                >
                                    {/* Product Info */}
                                    <div className="flex items-center gap-3 min-w-0">
                                        <div className="relative h-12 w-12 flex-shrink-0 rounded-lg overflow-hidden border border-stroke dark:border-stroke-dark bg-gray-1 dark:bg-dark-2">
                                            {item.image ? (
                                                <Image
                                                    src={item.image}
                                                    alt={item.productName}
                                                    fill
                                                    className="object-cover"
                                                    sizes="48px"
                                                />
                                            ) : (
                                                <div className="flex items-center justify-center h-full">
                                                    <Package className="h-5 w-5 text-slate-300" />
                                                </div>
                                            )}
                                        </div>
                                        <div className="min-w-0">
                                            <p className="text-sm font-bold text-dark-2 dark:text-stroke truncate">
                                                {item.productName}
                                            </p>
                                            <div className="flex items-center gap-1 mt-0.5">
                                                <Tag className="h-3 w-3 text-teal-dark flex-shrink-0" />
                                                <span className="text-[11px] font-medium text-teal uppercase tracking-wide truncate">
                                                    {item.sku}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Quantity */}
                                    <div className="flex justify-center">
                                        <span className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-blue-light-5 dark:bg-blue-dark/20 text-blue font-bold text-sm">
                                            {item.quantity}
                                        </span>
                                    </div>

                                    {/* Unit Price */}
                                    <div className="text-center">
                                        <span className="text-sm font-bold text-dark-2 dark:text-stroke">
                                            {formatCurrency(item.price)}
                                        </span>
                                    </div>

                                    {/* Subtotal */}
                                    <div className="text-right">
                                        <span className="text-sm font-bold text-green dark:text-green-light">
                                            {formatCurrency(item.subtotal)}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="px-7 py-6 border-t border-stroke dark:border-stroke-dark bg-gray-1 dark:bg-dark-2/30 rounded-b-2xl">
                    <div className="flex flex-col gap-4">
                        <div className="flex justify-between items-center text-sm font-bold">
                            <span className="text-slate-400 uppercase tracking-wider flex items-center gap-2">
                                <Package className="h-4 w-4" /> Items ({items.length})
                            </span>
                            <span className="text-dark-2 dark:text-meta-5">
                                {formatCurrency(items.reduce((acc, item) => acc + item.subtotal, 0))}
                            </span>
                        </div>
                        <div className="flex justify-between items-center text-sm font-bold">
                            <span className="text-slate-400 uppercase tracking-wider flex items-center gap-2">
                                <BadgePercent className="h-4 w-4 text-red" /> Discount
                            </span>
                            <span className="text-red font-bold">
                                -{formatCurrency(discountValue)}
                            </span>
                        </div>
                        <div className="pt-4 border-t border-stroke dark:border-stroke-dark flex justify-between items-center">
                            <span className="text-base font-bold text-dark-2 dark:text-white uppercase tracking-widest">Total Amount</span>
                            <span className="text-2xl font-bold text-blue dark:text-blue-light">
                                {formatCurrency(order.totalPrice)}
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Status Confirmation Modal */}
            {confirmingStatus && (
                <div className="fixed inset-0 z-[10000] flex items-center justify-center bg-dark-6/40 backdrop-blur-[2px] animate-in fade-in duration-200">
                    <div className="bg-white dark:bg-dark-2 rounded-2xl shadow-2xl w-full max-w-sm p-7 mx-4 transform transition-all animate-in zoom-in-95 duration-200 border border-stroke dark:border-stroke-dark">
                        <div className="flex items-center gap-4 mb-5">
                            <div className="bg-yellow-light-6 dark:bg-yellow/10 p-3 rounded-xl">
                                <AlertTriangle className="h-6 w-6 text-yellow" />
                            </div>
                            <h3 className="text-lg font-bold text-dark-2 dark:text-white tracking-tight">Confirm Update</h3>
                        </div>

                        <p className="text-slate-500 dark:text-slate-400 text-sm font-medium mb-8 leading-relaxed">
                            Are you sure you want to change the order status from&nbsp;
                            <span className={`font-bold ${statusConfig[order.status].text}`}>{statusConfig[order.status].label}</span>
                            &nbsp;to&nbsp;
                            <span className={`font-bold ${statusConfig[confirmingStatus].text}`}>{statusConfig[confirmingStatus].label}</span>?
                        </p>

                        <div className="flex gap-3 mt-6">
                            <button
                                onClick={() => setConfirmingStatus(null)}
                                className="flex-1 py-3 px-4 text-sm font-bold text-slate-500 hover:text-dark-2 hover:bg-gray-1 dark:hover:bg-dark-3 rounded-xl transition-all"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={() => handleStatusChange(confirmingStatus)}
                                disabled={isUpdatingStatus}
                                className="flex-1 py-3 px-4 text-sm font-bold text-white bg-blue hover:bg-blue-dark rounded-xl shadow-lg shadow-blue-200 dark:shadow-none transition-all active:scale-95 disabled:opacity-50"
                            >
                                {isUpdatingStatus ? "Updating..." : "Confirm"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
