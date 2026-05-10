import { useState, useEffect } from "react"
import { createPortal } from "react-dom"
import { X, PackagePlus, Search, Tag, Check } from "lucide-react"
import { toast } from "react-hot-toast"
import { DiscountAdminResponse, getVariantsNotInDiscount, addVariantDiscount } from "@/api/adminApi"

interface DiscountVariantsModalProps {
    isOpen: boolean
    onClose: () => void
    discount: DiscountAdminResponse | null
    onSuccess?: () => void
}

export default function DiscountVariantsModal({ isOpen, onClose, discount, onSuccess }: DiscountVariantsModalProps) {
    const [mounted, setMounted] = useState(false)
    const [variants, setVariants] = useState<any[]>([])
    const [isLoading, setIsLoading] = useState(false)
    const [inputValue, setInputValue] = useState("")
    const [searchKeyword, setSearchKeyword] = useState("")
    const [selectedIds, setSelectedIds] = useState<number[]>([])

    useEffect(() => {
        setMounted(true)
    }, [])

    useEffect(() => {
        const delay = inputValue ? 500 : 0
        const timeoutId = setTimeout(() => {
            setSearchKeyword(inputValue)
        }, delay)
        return () => clearTimeout(timeoutId)
    }, [inputValue])

    useEffect(() => {
        let ignore = false

        const fetchDiscountVariants = async () => {
            if (!discount) return
            setIsLoading(true)
            try {
                const response = await getVariantsNotInDiscount(discount.id, { page: 0, size: 1000, keyword: searchKeyword })
                if (!ignore) {
                    const data = Array.isArray(response) ? response : (response.content || response.data || [])
                    setVariants(data)
                }
            } catch (error) {
                if (!ignore) {
                    console.error("Error fetching discount variants:", error)
                    setVariants([])
                }
            } finally {
                if (!ignore) setIsLoading(false)
            }
        }

        if (isOpen && discount) {
            fetchDiscountVariants()
        }

        return () => {
            ignore = true
        }
    }, [isOpen, discount, searchKeyword])

    useEffect(() => {
        if (isOpen) {
            setSelectedIds([]) // Reset selections when modal opens initially or we want to keep it? Let's just keep as is, or reset when searchKeyword changes? Resetting on open is enough.
        }
    }, [isOpen])


    if (!mounted || !isOpen || !discount) return null


    const handleToggleSelect = (id: number) => {
        setSelectedIds(prev =>
            prev.includes(id) ? prev.filter(selectedId => selectedId !== id) : [...prev, id]
        )
    }

    const isAllSelected = variants.length > 0 && selectedIds.length === variants.length

    const handleSelectAll = () => {
        if (isAllSelected) {
            setSelectedIds([])
        } else {
            setSelectedIds(variants.map(v => v.id))
        }
    }

    const handleApply = async () => {
        if (!discount) return
        
        setIsLoading(true)
        try {
            await addVariantDiscount(discount.id, selectedIds)
            toast.success(`Successfully added ${selectedIds.length} variants to discount`)
            if (onSuccess) onSuccess()
            onClose()
        } catch (error) {
            console.error('Error adding variants to discount:', error)
            toast.error('Failed to add variants to discount')
        } finally {
            setIsLoading(false)
        }
    }

    return createPortal(
        <div
            className="fixed inset-0 z-[100] flex justify-end bg-black/60 backdrop-blur-sm"
            onClick={onClose}
        >
            <div
                className="bg-white dark:bg-dark-3 shadow-2xl w-full max-w-2xl h-full transform transition-all animate-in slide-in-from-right duration-300 flex flex-col"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-100 dark:border-dark-4 shrink-0">
                    <div className="flex items-center gap-3">
                        <div className="bg-green-100 dark:bg-green-900/30 p-2 rounded-lg">
                            <PackagePlus className="h-6 w-6 text-green" />
                        </div>
                        <div>
                            <h2 className="text-xl font-black text-dark-2 dark:text-meta-5">
                                Add Variants to Discount
                            </h2>
                            <p className="text-sm text-slate-500 font-medium mt-0.5">
                                Select variants to add to {discount.name}
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-gray-100 dark:hover:bg-dark-4 rounded-full transition-colors text-dark-2"
                    >
                        <X className="h-6 w-6 text-dark-2 hover:text-red-500 transition-colors" />
                    </button>
                </div>

                {/* Search Bar & Actions */}
                <div className="p-4 border-b border-gray-100 dark:border-dark-4 bg-gray-50/50 dark:bg-dark-2/30 shrink-0 flex flex-col sm:flex-row gap-3">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Search variants..."
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 dark:border-dark-4 bg-white dark:bg-dark-3 text-sm focus:outline-none focus:ring-2 focus:ring-green/20 transition-all text-dark-2 dark:text-meta-5"
                        />
                    </div>
                    <div className="flex items-center">
                        <button
                            onClick={handleSelectAll}
                            className="px-4 py-2.5 text-sm font-bold text-dark-2 dark:text-meta-5 bg-white dark:bg-dark-3 hover:bg-gray-50 dark:hover:bg-dark-4 rounded-xl transition-all active:scale-95 border border-gray-200 dark:border-dark-4 whitespace-nowrap flex items-center gap-2"
                        >
                            <div className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${isAllSelected
                                ? 'border-green bg-green text-white'
                                : 'border-gray-300 dark:border-dark-4'
                                }`}>
                                <Check className={`w-3 h-3 ${isAllSelected ? 'text-white' : 'text-transparent'}`} />
                            </div>
                            {isAllSelected ? 'Bỏ chọn tất cả' : 'Chọn tất cả'}
                        </button>
                    </div>
                </div>

                {/* Content */}
                <div className="p-6 overflow-y-auto flex-1">
                    {isLoading ? (
                        <div className="flex flex-col items-center justify-center py-12 gap-3">
                            <div className="w-8 h-8 border-3 border-green border-t-transparent rounded-full animate-spin"></div>
                            <span className="text-sm font-bold text-slate-400 uppercase tracking-widest">Loading variants...</span>
                        </div>
                    ) : variants.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {variants.map((variant, index) => (
                                <div
                                    key={index}
                                    onClick={() => handleToggleSelect(variant.id)}
                                    className={`bg-white dark:bg-dark-2 border rounded-xl p-4 flex flex-col gap-3 transition-colors cursor-pointer group ${selectedIds.includes(variant.id)
                                        ? 'border-green ring-1 ring-green'
                                        : 'border-gray-100 dark:border-dark-4 hover:border-green'
                                        }`}
                                >
                                    <div className="flex items-start gap-3">
                                        <div className="w-16 h-16 rounded-lg bg-gray-50 dark:bg-dark-3 border border-gray-100 dark:border-dark-4 overflow-hidden shrink-0">
                                            {variant.image ? (
                                                <img src={variant.image} alt={variant.sku} className="w-full h-full object-cover" />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center text-slate-300">
                                                    <Tag className="w-6 h-6" />
                                                </div>
                                            )}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <h4 className="font-bold text-dark-2 dark:text-meta-5 truncate" title={variant.sku}>
                                                {variant.sku}
                                            </h4>
                                            <div className="flex items-center gap-2 mt-1">
                                                <div className="w-3 h-3 rounded-full border border-gray-200 dark:border-dark-4 shadow-sm" style={{ backgroundColor: variant.color?.hexCode || '#ccc' }} />
                                                <span className="text-xs text-slate-500 font-medium truncate">{variant.color?.name}</span>
                                            </div>
                                            <div className="mt-2 flex items-center justify-between">
                                                <span className="text-sm font-bold text-green">
                                                    ${variant.price}
                                                </span>
                                                <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${selectedIds.includes(variant.id)
                                                    ? 'border-green bg-green text-white'
                                                    : 'border-gray-300 dark:border-dark-4 group-hover:border-green group-hover:bg-green/10'
                                                    }`}>
                                                    <Check className={`w-3 h-3 ${selectedIds.includes(variant.id) ? 'text-white' : 'text-transparent group-hover:text-green'}`} />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center py-16 gap-3 opacity-50">
                            <PackagePlus className="w-12 h-12 text-slate-400" />
                            <p className="text-sm font-bold text-dark-2 dark:text-meta-5">No variants found</p>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="flex justify-end gap-3 p-6 border-t border-gray-100 dark:border-dark-4 shrink-0 bg-gray-50/50 dark:bg-dark-2/30">
                    <button
                        onClick={onClose}
                        className="px-6 py-2.5 text-sm font-bold text-dark-2 dark:text-meta-5 bg-white dark:bg-dark-3 hover:bg-gray-50 dark:hover:bg-dark-4 rounded-xl transition-all active:scale-95 border border-gray-200 dark:border-dark-4"
                    >
                        Close
                    </button>
                    <button
                        onClick={handleApply}
                        disabled={selectedIds.length === 0}
                        className={`px-6 py-2.5 text-sm font-bold text-white rounded-xl transition-all flex items-center gap-2 ${selectedIds.length > 0
                            ? 'bg-green hover:bg-green-dark active:scale-95 shadow-lg shadow-green/20 dark:shadow-none'
                            : 'bg-green/50 cursor-not-allowed'
                            }`}
                    >
                        <Check className="w-4 h-4" />
                        Apply to Discount {selectedIds.length > 0 && `(${selectedIds.length})`}
                    </button>
                </div>
            </div>
        </div>,
        document.body
    )
}
