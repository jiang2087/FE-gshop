"use client"
import { useEffect, useState, useRef } from "react"
import { Plus, Ticket, Search, Filter, Check } from "lucide-react"
import { columns } from "./Vouchers/columns"
import { VoucherDataTable } from "./Vouchers/data-table"

export default function VoucherManagement() {
    const [addModalOpen, setAddModalOpen] = useState(false)
    const [searchKeyword, setSearchKeyword] = useState("")
    const [debouncedSearchKeyword, setDebouncedSearchKeyword] = useState("")
    const [selectedStatus, setSelectedStatus] = useState<string | undefined>(undefined);
    const [showFilter, setShowFilter] = useState(false);
    const filterRef = useRef<HTMLDivElement>(null);

    const statuses = ["ACTIVE", "INACTIVE"];

    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearchKeyword(searchKeyword)
        }, 500)
        return () => clearTimeout(timer)
    }, [searchKeyword])

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (filterRef.current && !filterRef.current.contains(event.target as Node)) {
                setShowFilter(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold text-dark-2 dark:text-white tracking-tight">
                        Vouchers
                    </h2>
                    <p className="text-sm text-slate-400 font-medium mt-1">
                        Create and track promo codes for your customers
                    </p>
                </div>
                <button
                    onClick={() => setAddModalOpen(true)}
                    className="flex items-center gap-2 px-5 py-2.5 bg-yellow hover:bg-yellow-dark text-white rounded-xl font-bold transition-all active:scale-95 shadow-lg shadow-yellow-200 dark:shadow-none"
                >
                    <Plus className="h-5 w-5" />
                    New Voucher
                </button>
            </div>

            <div className="bg-white dark:bg-gray-dark rounded-2xl shadow-sm border border-stroke dark:border-stroke-dark overflow-hidden">
                <div className="p-6 border-b border-stroke dark:border-stroke-dark flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-gray-1 dark:bg-dark-3">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-yellow-light-6 rounded-lg text-yellow">
                            <Ticket className="h-5 w-5" />
                        </div>
                        <div>
                            <h3 className="text-lg font-bold text-dark-2 dark:text-white tracking-tight">Active Vouchers</h3>
                            <p className="text-sm text-slate-400 font-medium mt-0.5">Search and manage your vouchers</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-3 w-full sm:w-auto">
                        <div className="relative flex-1 sm:w-64">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                            <input
                                type="text"
                                placeholder="Search by code or status"
                                value={searchKeyword}
                                onChange={(e) => setSearchKeyword(e.target.value)}
                                className="w-full pl-10 pr-4 py-2.5 rounded-xl text-dark-2 dark:text-meta-5 border border-stroke dark:border-stroke-dark bg-white dark:bg-dark-3 text-sm focus:outline-none focus:ring-2 focus:ring-yellow/20 transition-all font-medium"
                            />
                        </div>

                        <div className="relative" ref={filterRef}>
                            <button
                                onClick={() => setShowFilter(!showFilter)}
                                className={`p-2.5 rounded-xl border transition-all flex items-center gap-2 ${selectedStatus
                                    ? "bg-yellow/10 border-yellow text-yellow"
                                    : "border-stroke dark:border-stroke-dark bg-white dark:bg-dark-3 hover:bg-gray-1 dark:hover:bg-dark-2 text-slate-500 dark:text-meta-5"
                                    }`}
                                title="Filter by status"
                            >
                                <Filter className="h-5 w-5" />
                                {selectedStatus && (
                                    <span className="text-xs font-bold uppercase tracking-wider hidden md:block">
                                        {selectedStatus}
                                    </span>
                                )}
                            </button>

                            {showFilter && (
                                <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-dark-2 rounded-xl shadow-2xl border border-stroke dark:border-stroke-dark overflow-hidden z-[100] animate-in slide-in-from-top-2 duration-200">
                                    <div className="p-1.5 space-y-1">
                                        <div className="px-3 py-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest border-b border-stroke dark:border-stroke-dark mb-1">
                                            Filter Status
                                        </div>
                                        <button
                                            onClick={() => {
                                                setSelectedStatus(undefined);
                                                setShowFilter(false);
                                            }}
                                            className="w-full flex items-center justify-between px-3 py-2.5 rounded-lg hover:bg-gray-1 dark:hover:bg-dark-3 transition-colors text-left group"
                                        >
                                            <span className={`text-xs font-bold uppercase tracking-wide ${!selectedStatus ? "text-yellow" : "text-slate-500"}`}>
                                                All Statuses
                                            </span>
                                            {!selectedStatus && <Check className="h-4 w-4 text-yellow" />}
                                        </button>
                                        {statuses.map((status) => (
                                            <button
                                                key={status}
                                                onClick={() => {
                                                    setSelectedStatus(status);
                                                    setShowFilter(false);
                                                }}
                                                className="w-full flex items-center justify-between px-3 py-2.5 rounded-lg hover:bg-gray-1 dark:hover:bg-dark-3 transition-colors text-left group"
                                            >
                                                <span className={`text-xs font-bold uppercase tracking-wide ${selectedStatus === status ? "text-yellow" : "text-slate-500"}`}>
                                                    {status}
                                                </span>
                                                {selectedStatus === status && <Check className="h-4 w-4 text-yellow" />}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                <div className="p-0">
                    <VoucherDataTable
                        columns={columns}
                        addModalOpen={addModalOpen}
                        setAddModalOpen={setAddModalOpen}
                        searchKeyword={debouncedSearchKeyword}
                        status={selectedStatus}
                    />
                </div>
            </div>
        </div>
    );
}