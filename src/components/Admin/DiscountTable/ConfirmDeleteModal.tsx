"use client"

import { AlertTriangle, X, Trash2 } from "lucide-react"

interface ConfirmDeleteModalProps {
    isOpen: boolean
    onClose: () => void
    onConfirm: () => void
    isDeleting: boolean
    title: string
    description: string
}

export default function ConfirmDeleteModal({
    isOpen,
    onClose,
    onConfirm,
    isDeleting,
    title,
    description,
}: ConfirmDeleteModalProps) {
    if (!isOpen) return null

    return (
        <div
            className="fixed inset-0 z-[9999] flex items-center justify-center bg-dark-6/60 backdrop-blur-sm animate-in fade-in duration-300"
            onClick={(e) => e.target === e.currentTarget && onClose()}
        >
            <div className="bg-white dark:bg-gray-dark rounded-2xl shadow-2xl w-full max-w-md mx-4 animate-in zoom-in-95 duration-200 border border-stroke dark:border-stroke-dark overflow-hidden">
                {/* Header */}
                <div className="flex items-center justify-between px-7 py-5 border-b border-stroke dark:border-stroke-dark">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-red-light-6 dark:bg-red-dark/10 rounded-xl">
                            <AlertTriangle className="h-6 w-6 text-red" />
                        </div>
                        <h3 className="text-lg font-bold text-dark-2 dark:text-white tracking-tight">
                            {title}
                        </h3>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 rounded-xl text-slate-400 hover:text-dark-2 dark:hover:text-white hover:bg-gray-2 dark:hover:bg-dark-3 transition-all active:scale-90"
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>

                {/* Body */}
                <div className="px-7 py-6">
                    <p className="text-slate-500 dark:text-slate-400 text-sm font-medium leading-relaxed">
                        {description}
                    </p>
                    <div className="mt-4 p-3 rounded-xl bg-red-light-6/50 dark:bg-red-dark/5 border border-red-light-5 dark:border-red-dark/20">
                        <p className="text-xs font-bold text-red dark:text-red-light flex items-center gap-2">
                            <AlertTriangle className="h-3.5 w-3.5" />
                            This action cannot be undone.
                        </p>
                    </div>
                </div>

                {/* Footer */}
                <div className="flex gap-3 px-7 py-5 border-t border-stroke dark:border-stroke-dark bg-gray-1 dark:bg-dark-2/30">
                    <button
                        onClick={onClose}
                        disabled={isDeleting}
                        className="flex-1 py-3 px-4 text-sm font-bold text-slate-500 hover:text-dark-2 dark:hover:text-white hover:bg-gray-2 dark:hover:bg-dark-3 rounded-xl transition-all active:scale-95 disabled:opacity-50"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={onConfirm}
                        disabled={isDeleting}
                        className="flex-1 py-3 px-4 text-sm font-bold text-white bg-red hover:bg-red-dark rounded-xl shadow-lg shadow-red-200 dark:shadow-none transition-all active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                        {isDeleting ? (
                            <>
                                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                Deleting...
                            </>
                        ) : (
                            <>
                                <Trash2 className="h-4 w-4" />
                                Delete
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    )
}
