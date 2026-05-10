"use client"

import { useEffect, useState } from "react"
import { TopUserResponse, getTopPurchasers } from "@/api/adminApi"
import { Trophy, Eye, DollarSign, Calendar, Mail, User } from "lucide-react"
import dayjs from "dayjs"
import UserOrdersModal from "./UserOrdersModal"

export default function TopUsersTable() {
    const [topUsers, setTopUsers] = useState<TopUserResponse[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [selectedUserId, setSelectedUserId] = useState<number | null>(null)
    const [isOrdersModalOpen, setIsOrdersModalOpen] = useState(false)

    useEffect(() => {
        const fetchTopUsers = async () => {
            try {
                const data = await getTopPurchasers({ page: 0, size: 5 })
                setTopUsers(data.content || data || [])
            } catch (error) {
                console.error("Failed to fetch top users")
            } finally {
                setIsLoading(false)
            }
        }
        fetchTopUsers()
    }, [])

    const handleViewOrders = (userId: number) => {
        setSelectedUserId(userId)
        setIsOrdersModalOpen(true)
    }

    if (isLoading) {
        return (
            <div className="bg-white dark:bg-gray-dark rounded-2xl shadow-sm border border-stroke dark:border-stroke-dark p-6 mt-6 flex justify-center items-center h-48">
                <div className="flex flex-col items-center gap-3">
                    <div className="w-8 h-8 border-3 border-yellow dark:border-yellow border-t-transparent rounded-full animate-spin"></div>
                    <span className="text-sm font-bold text-slate-400 uppercase tracking-widest">Loading top users...</span>
                </div>
            </div>
        )
    }

    return (
        <div className="bg-white dark:bg-gray-dark rounded-2xl shadow-sm border border-stroke dark:border-stroke-dark overflow-hidden mt-6 animate-in fade-in slide-in-from-bottom-4 duration-500 delay-100">
            <div className="p-6 border-b border-stroke dark:border-stroke-dark flex items-center gap-3 bg-gradient-to-r from-yellow/10 via-white to-white dark:from-yellow/5 dark:via-dark-3 dark:to-dark-3">
                <div className="p-2.5 bg-yellow rounded-xl text-white shadow-lg shadow-yellow/30">
                    <Trophy className="h-5 w-5" />
                </div>
                <div>
                    <h2 className="text-xl font-bold text-dark-2 dark:text-meta-5">Top Customers</h2>
                    <p className="text-sm text-slate-400 font-medium mt-0.5">Users with the highest total purchase value</p>
                </div>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-gray-1 dark:bg-dark-2/50 border-b border-stroke dark:border-stroke-dark">
                            <th className="py-4 px-6 font-bold text-sm text-dark-2 dark:text-meta-5">User</th>
                            <th className="py-4 px-6 font-bold text-sm text-dark-2 dark:text-meta-5">Contact</th>
                            <th className="py-4 px-6 font-bold text-sm text-dark-2 dark:text-meta-5 text-center">Total Purchased</th>
                            <th className="py-4 px-6 font-bold text-sm text-dark-2 dark:text-meta-5 text-center">Last Purchase</th>
                            <th className="py-4 px-6 font-bold text-sm text-dark-2 dark:text-meta-5 text-center">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {topUsers.length === 0 ? (
                            <tr>
                                <td colSpan={5} className="py-8 text-center text-slate-400 font-medium">
                                    No top users found.
                                </td>
                            </tr>
                        ) : (
                            topUsers.map((user, index) => (
                                <tr key={user.userId} className="hover:bg-gray-1 dark:hover:bg-dark-2/20 transition-colors border-b border-stroke dark:border-stroke-dark last:border-0 group">
                                    <td className="py-4 px-6">
                                        <div className="flex items-center gap-3">
                                            <div className="relative">
                                                <div className="h-10 w-10 flex items-center justify-center rounded-full bg-blue-light-5 text-blue dark:bg-dark-3 dark:text-blue-light">
                                                    <User className="h-5 w-5" />
                                                </div>
                                                {index < 3 && (
                                                    <div className="absolute -top-1.5 -right-1.5 h-5 w-5 flex items-center justify-center rounded-full bg-yellow text-white text-[10px] font-bold border-2 border-white dark:border-gray-dark shadow-sm">
                                                        {index + 1}
                                                    </div>
                                                )}
                                            </div>
                                            <div className="flex flex-col">
                                                <span className="font-bold text-dark-2 dark:text-meta-5">{user.username}</span>
                                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mt-0.5">ID: {user.userId}</span>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="py-4 px-6">
                                        <div className="flex items-center gap-2 text-sm font-medium text-slate-500 dark:text-slate-400">
                                            <Mail className="h-4 w-4 text-slate-400" />
                                            {user.email}
                                        </div>
                                    </td>
                                    <td className="py-4 px-6">
                                        <div className="flex justify-center">
                                            <div className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-green-light-6 text-green dark:bg-dark-3 dark:text-green-light font-bold text-sm">
                                                <DollarSign className="h-4 w-4" />
                                                {new Intl.NumberFormat('en-US').format(user.totalPurchased)}
                                            </div>
                                        </div>
                                    </td>
                                    <td className="py-4 px-6">
                                        <div className="flex flex-col items-center justify-center">
                                            <div className="flex items-center gap-1.5 text-xs font-bold text-dark-2 dark:text-meta-5">
                                                <Calendar className="h-3.5 w-3.5 text-slate-400" />
                                                {dayjs(user.lastPurchase).format("MMM DD, YYYY")}
                                            </div>
                                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mt-1">
                                                {dayjs(user.lastPurchase).format("hh:mm A")}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="py-4 px-6">
                                        <div className="flex justify-center">
                                            <button
                                                onClick={() => handleViewOrders(user.userId)}
                                                className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold text-blue bg-blue-light-5 hover:bg-blue hover:text-white dark:bg-dark-3 dark:text-blue-light dark:hover:bg-blue dark:hover:text-white transition-all active:scale-95"
                                            >
                                                <Eye className="h-4 w-4" />
                                                Orders
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {selectedUserId && (
                <UserOrdersModal
                    userId={selectedUserId}
                    isOpen={isOrdersModalOpen}
                    onClose={() => {
                        setIsOrdersModalOpen(false)
                        setSelectedUserId(null)
                    }}
                />
            )}
        </div>
    )
}
