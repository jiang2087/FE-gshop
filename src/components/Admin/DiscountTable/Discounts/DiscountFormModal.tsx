"use client"

import { useEffect, useState } from "react"
import { X, Tag, Calendar, DollarSign, Percent, ToggleLeft, ToggleRight } from "lucide-react"
import { DiscountAdminResponse, DiscountRequest } from "@/api/adminApi"
import dayjs from "dayjs"

interface DiscountFormModalProps {
    isOpen: boolean
    onClose: () => void
    onSubmit: (data: DiscountRequest) => Promise<void>
    discount?: DiscountAdminResponse | null
    isSubmitting: boolean
}

export default function DiscountFormModal({
    isOpen,
    onClose,
    onSubmit,
    discount,
    isSubmitting,
}: DiscountFormModalProps) {
    const isEdit = !!discount

    const [name, setName] = useState("")
    const [type, setType] = useState<"FIXED_AMOUNT" | "PERCENTAGE">("PERCENTAGE")
    const [value, setValue] = useState<number>(0)
    const [startDate, setStartDate] = useState("")
    const [endDate, setEndDate] = useState("")
    const [active, setActive] = useState(true)

    useEffect(() => {
        if (isOpen && discount) {
            setName(discount.name)
            setType(discount.type)
            setValue(discount.value)
            setStartDate(dayjs(discount.startDate).format("YYYY-MM-DDTHH:mm"))
            setEndDate(dayjs(discount.endDate).format("YYYY-MM-DDTHH:mm"))
            setActive(discount.active)
        } else if (isOpen && !discount) {
            setName("")
            setType("PERCENTAGE")
            setValue(0)
            setStartDate("")
            setEndDate("")
            setActive(true)
        }
    }, [isOpen, discount])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        await onSubmit({
            name,
            type,
            value,
            startDate: dayjs(startDate).toISOString(),
            endDate: dayjs(endDate).toISOString(),
            active,
        })
    }

    if (!isOpen) return null

    return (
        <div
            className="fixed inset-0 z-[9999] flex items-center justify-center bg-dark-6/60 backdrop-blur-sm animate-in fade-in duration-300"
            onClick={(e) => e.target === e.currentTarget && onClose()}
        >
            <div className="bg-white dark:bg-gray-dark rounded-2xl shadow-2xl w-full max-w-lg mx-4 max-h-[90vh] flex flex-col animate-in zoom-in-95 duration-200 border border-stroke dark:border-stroke-dark">
                {/* Header */}
                <div className="flex items-center justify-between px-7 py-5 border-b border-stroke dark:border-stroke-dark">
                    <div className="flex items-center gap-4">
                        <div className="p-2.5 bg-blue-light-5 dark:bg-blue-dark/20 rounded-xl">
                            <Tag className="h-6 w-6 text-blue" />
                        </div>
                        <div>
                            <h2 className="text-lg font-bold text-dark-2 dark:text-white tracking-tight">
                                {isEdit ? "Edit Discount" : "New Discount"}
                            </h2>
                            <p className="text-sm text-slate-400 font-medium mt-0.5">
                                {isEdit ? `Editing "${discount?.name}"` : "Create a new store-wide discount"}
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 rounded-xl text-slate-400 hover:text-dark-2 dark:hover:text-white hover:bg-gray-2 dark:hover:bg-dark-3 transition-all active:scale-90"
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto">
                    <div className="px-7 py-6 space-y-5">
                        {/* Name */}
                        <div>
                            <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
                                Discount Name
                            </label>
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required
                                placeholder="e.g. Summer Sale 2026"
                                className="w-full h-12 px-4 rounded-xl border border-stroke dark:border-stroke-dark bg-white dark:bg-dark-2 text-dark-2 dark:text-white font-medium text-sm focus:outline-none focus:ring-2 focus:ring-blue/20 focus:border-blue transition-all placeholder:text-slate-300 dark:placeholder:text-slate-600"
                            />
                        </div>

                        {/* Type & Value Row */}
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
                                    Type
                                </label>
                                <select
                                    value={type}
                                    onChange={(e) => setType(e.target.value as "FIXED_AMOUNT" | "PERCENTAGE")}
                                    className="w-full h-12 px-4 rounded-xl border border-stroke dark:border-stroke-dark bg-white dark:bg-dark-2 text-dark-2 dark:text-white font-medium text-sm focus:outline-none focus:ring-2 focus:ring-blue/20 focus:border-blue transition-all"
                                >
                                    <option value="PERCENTAGE">Percentage (%)</option>
                                    <option value="FIXED_AMOUNT">Fixed Amount ($)</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
                                    Value
                                </label>
                                <div className="relative">
                                    <input
                                        type="number"
                                        value={value}
                                        onChange={(e) => setValue(Number(e.target.value))}
                                        required
                                        min={0}
                                        step="0.01"
                                        className="w-full h-12 px-4 pr-10 rounded-xl border border-stroke dark:border-stroke-dark bg-white dark:bg-dark-2 text-dark-2 dark:text-white font-medium text-sm focus:outline-none focus:ring-2 focus:ring-blue/20 focus:border-blue transition-all"
                                    />
                                    <div className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">
                                        {type === "PERCENTAGE" ? (
                                            <Percent className="h-4 w-4" />
                                        ) : (
                                            <DollarSign className="h-4 w-4" />
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Date Range */}
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
                                    <span className="flex items-center gap-1.5">
                                        <Calendar className="h-3.5 w-3.5" /> Start Date
                                    </span>
                                </label>
                                <input
                                    type="datetime-local"
                                    value={startDate}
                                    onChange={(e) => setStartDate(e.target.value)}
                                    required
                                    className="w-full h-12 px-4 rounded-xl border border-stroke dark:border-stroke-dark bg-white dark:bg-dark-2 text-dark-2 dark:text-white font-medium text-sm focus:outline-none focus:ring-2 focus:ring-blue/20 focus:border-blue transition-all"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
                                    <span className="flex items-center gap-1.5">
                                        <Calendar className="h-3.5 w-3.5" /> End Date
                                    </span>
                                </label>
                                <input
                                    type="datetime-local"
                                    value={endDate}
                                    onChange={(e) => setEndDate(e.target.value)}
                                    required
                                    className="w-full h-12 px-4 rounded-xl border border-stroke dark:border-stroke-dark bg-white dark:bg-dark-2 text-dark-2 dark:text-white font-medium text-sm focus:outline-none focus:ring-2 focus:ring-blue/20 focus:border-blue transition-all"
                                />
                            </div>
                        </div>

                        {/* Active Toggle */}
                        <div className="flex items-center justify-between p-4 rounded-xl bg-gray-1 dark:bg-dark-2/50 border border-stroke dark:border-stroke-dark">
                            <div>
                                <span className="text-sm font-bold text-dark-2 dark:text-white">Status</span>
                                <p className="text-xs text-slate-400 font-medium mt-0.5">
                                    {active ? "This discount is currently active" : "This discount is currently inactive"}
                                </p>
                            </div>
                            <button
                                type="button"
                                onClick={() => setActive(!active)}
                                className={`relative w-14 h-8 rounded-full transition-all duration-300 ${
                                    active
                                        ? "bg-green shadow-lg shadow-green-200 dark:shadow-none"
                                        : "bg-slate-300 dark:bg-dark-3"
                                }`}
                            >
                                <span
                                    className={`absolute top-1 w-6 h-6 bg-white rounded-full shadow-md transition-all duration-300 ${
                                        active ? "left-7" : "left-1"
                                    }`}
                                />
                            </button>
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="flex gap-3 px-7 py-5 border-t border-stroke dark:border-stroke-dark bg-gray-1 dark:bg-dark-2/30 rounded-b-2xl">
                        <button
                            type="button"
                            onClick={onClose}
                            disabled={isSubmitting}
                            className="flex-1 py-3 px-4 text-sm font-bold text-slate-500 hover:text-dark-2 dark:hover:text-white hover:bg-gray-2 dark:hover:bg-dark-3 rounded-xl transition-all active:scale-95 disabled:opacity-50"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="flex-1 py-3 px-4 text-sm font-bold text-white bg-blue hover:bg-blue-dark rounded-xl shadow-lg shadow-blue-200 dark:shadow-none transition-all active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2"
                        >
                            {isSubmitting ? (
                                <>
                                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                    {isEdit ? "Updating..." : "Creating..."}
                                </>
                            ) : (
                                isEdit ? "Update Discount" : "Create Discount"
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}
