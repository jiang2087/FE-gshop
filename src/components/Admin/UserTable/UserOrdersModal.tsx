"use client"

import { useEffect, useState } from "react"
import { getOrdersByUserIdAdmin, OrderAdminResponse } from "@/api/adminApi"
import { X, Package, Calendar, DollarSign, CreditCard } from "lucide-react"
import dayjs from "dayjs"

interface UserOrdersModalProps {
    userId: number
    isOpen: boolean
    onClose: () => void
}

const statusConfig = {
    PENDING: { label: "Pending", className: "bg-yellow/10 text-yellow" },
    PROCESSING: { label: "Processing", className: "bg-blue/10 text-blue" },
    SHIPPED: { label: "Shipped", className: "bg-primary/10 text-primary" },
    COMPLETED: { label: "Completed", className: "bg-green/10 text-green" },
    CANCELLED: { label: "Cancelled", className: "bg-red/10 text-red" }
}

export default function UserOrdersModal({ userId, isOpen, onClose }: UserOrdersModalProps) {
    const [orders, setOrders] = useState<OrderAdminResponse[]>([])
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        if (!isOpen) return

        const fetchOrders = async () => {
            setIsLoading(true)
            try {
                // If backend returns paginated OrderAdminResponse, handle `.content`. Otherwise assume it's an array.
                const data = await getOrdersByUserIdAdmin(userId)
                setOrders(data.content || data || [])
            } catch (error) {
                console.error("Failed to fetch user orders")
            } finally {
                setIsLoading(false)
            }
        }

        fetchOrders()
    }, [isOpen, userId])

    if (!isOpen) return null

    return (
        <div
            className="fixed inset-0 z-[9999] flex items-center justify-center bg-dark-6/60 backdrop-blur-sm animate-in fade-in duration-300 p-4"
            onClick={(e) => e.target === e.currentTarget && onClose()}
        >
            <div className="bg-white dark:bg-gray-dark rounded-2xl shadow-2xl w-full max-w-4xl max-h-[85vh] flex flex-col transform transition-all animate-in zoom-in-95 duration-200">
                <div className="flex items-center justify-between px-7 py-5 border-b border-stroke dark:border-stroke-dark">
                    <div className="flex items-center gap-4">
                        <div className="p-2.5 bg-blue-light-5 dark:bg-dark-3 rounded-xl text-blue">
                            <Package className="h-6 w-6" />
                        </div>
                        <div>
                            <h3 className="text-xl font-bold text-dark-2 dark:text-white tracking-tight">
                                User Orders History
                            </h3>
                            <p className="text-sm text-slate-400 font-medium mt-0.5">
                                User ID: <span className="text-blue font-bold">#{userId}</span>
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 rounded-xl text-slate-400 hover:text-dark-2 dark:hover:text-white hover:bg-gray-2 dark:hover:bg-dark-3 transition-all"
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>

                <div className="p-6 overflow-y-auto custom-scrollbar flex-1">
                    {isLoading ? (
                        <div className="flex flex-col items-center justify-center py-20 gap-3">
                            <div className="w-8 h-8 border-3 border-blue border-t-transparent rounded-full animate-spin"></div>
                            <span className="text-sm font-bold text-slate-400 uppercase tracking-widest">Loading orders...</span>
                        </div>
                    ) : orders.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-20 gap-3 opacity-50">
                            <Package className="h-12 w-12 text-slate-400" />
                            <span className="text-base font-bold text-slate-500">No orders found for this user.</span>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {orders.map((order) => {
                                const config = statusConfig[order.status as keyof typeof statusConfig] || statusConfig.PENDING
                                return (
                                    <div key={order.id} className="bg-gray-1 dark:bg-dark-2 rounded-xl p-5 border border-stroke dark:border-stroke-dark hover:border-blue/30 transition-colors">
                                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
                                            <div className="flex items-center gap-3">
                                                <div className="flex flex-col">
                                                    <span className="text-sm font-bold text-dark-2 dark:text-white flex items-center gap-2">
                                                        <span className="uppercase text-blue tracking-wider">#{order.orderCode}</span>
                                                    </span>
                                                    <span className="text-[11px] font-bold text-slate-400 flex items-center gap-1.5 mt-1">
                                                        <Calendar className="h-3 w-3" />
                                                        {dayjs(order.createdAt).format("MMM DD, YYYY hh:mm A")}
                                                    </span>
                                                </div>
                                            </div>
                                            <span className={`inline-flex px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider ${config.className}`}>
                                                {config.label}
                                            </span>
                                        </div>

                                        <div className="flex items-center gap-6 pt-4 border-t border-stroke dark:border-dark-3">
                                            <div className="flex items-center gap-2">
                                                <DollarSign className="h-4 w-4 text-green" />
                                                <span className="font-bold text-dark-2 dark:text-white">
                                                    {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(order.totalPrice)}
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-2 text-sm font-medium text-slate-500 dark:text-slate-400">
                                                <CreditCard className="h-4 w-4" />
                                                {order.paymentMethod}
                                            </div>
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
