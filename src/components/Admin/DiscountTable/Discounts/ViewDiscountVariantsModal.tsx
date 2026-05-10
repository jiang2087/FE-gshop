import { useState, useEffect } from "react"
import { createPortal } from "react-dom"
import { X, PackagePlus, Search, Tag, Edit, Trash2 } from "lucide-react"
import { toast } from "react-hot-toast"
import { DiscountAdminResponse, getVariantsInDiscount, removeVariantDiscount } from "@/api/adminApi"
import api from '@/api/axiosInstace'
import DiscountVariantsModal from "./DiscountVariantsModal"

interface ViewDiscountVariantsModalProps {
    isOpen: boolean
    onClose: () => void
    discount: DiscountAdminResponse | null
}

export default function ViewDiscountVariantsModal({ isOpen, onClose, discount }: ViewDiscountVariantsModalProps) {
    const [mounted, setMounted] = useState(false)
    const [variants, setVariants] = useState<any[]>([])
    const [isLoading, setIsLoading] = useState(false)
    const [inputValue, setInputValue] = useState("")
    const [searchKeyword, setSearchKeyword] = useState("")
    const [isAddModalOpen, setIsAddModalOpen] = useState(false)

    useEffect(() => {
        setMounted(true)
    }, [])

    useEffect(() => {
        const delay = 500
        const timeoutId = setTimeout(() => {
            setSearchKeyword(inputValue)
        }, delay)
        return () => clearTimeout(timeoutId)
    }, [inputValue])

    const fetchDiscountVariants = async () => {
        if (!discount) return
        setIsLoading(true)
        try {
            const response = await getVariantsInDiscount(discount.id, { page: 0, size: 1000, keyword: searchKeyword })
            const data = Array.isArray(response) ? response : (response.content || response.data || [])
            setVariants(data)
        } catch (error) {
            console.error("Error fetching discount variants:", error)
            setVariants([])
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        if (isOpen && discount) {
            fetchDiscountVariants()
        }
    }, [isOpen, discount, searchKeyword])

    const handleRemoveVariant = async (variantId: number) => {
        if (!discount) return
        
        if (!confirm("Are you sure you want to remove this variant from the discount?")) return

        try {
            await removeVariantDiscount(discount.id, variantId)
            toast.success("Removed variant from discount")
            fetchDiscountVariants()
        } catch (error) {
            console.error("Error removing variant:", error)
            toast.error("Failed to remove variant")
        }
    }


    if (!mounted || !isOpen || !discount) return null


    return (
        <>
            {createPortal(
                <div
                    className="fixed inset-0 z-[100] flex items-start justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto pt-10"
                    onClick={onClose}
                >
                    <div
                        className="bg-white dark:bg-dark-3 rounded-2xl shadow-2xl w-full max-w-4xl transform transition-all animate-in zoom-in duration-300 my-8 flex flex-col max-h-[85vh]"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between p-6 border-b border-gray-100 dark:border-dark-4 shrink-0">
                            <div className="flex items-center gap-3">
                                <div className="bg-blue-100 dark:bg-blue-900/30 p-2 rounded-lg">
                                    <Tag className="h-6 w-6 text-blue" />
                                </div>
                                <div>
                                    <h2 className="text-xl font-black text-dark-2 dark:text-meta-5">
                                        Variants in Discount
                                    </h2>
                                    <p className="text-sm text-slate-500 font-medium mt-0.5">
                                        {discount.name} ({discount.type === 'PERCENTAGE' ? `${discount.value}%` : `$${discount.value}`})
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

                        {/* Search Bar */}
                        <div className="p-4 border-b border-gray-100 dark:border-dark-4 bg-gray-50/50 dark:bg-dark-2/30 shrink-0">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                                <input
                                    type="text"
                                    placeholder="Search variants..."
                                    value={inputValue}
                                    onChange={(e) => setInputValue(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 dark:border-dark-4 bg-white dark:bg-dark-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue/20 transition-all text-dark-2 dark:text-meta-5"
                                />
                            </div>
                        </div>

                        {/* Content */}
                        <div className="p-6 overflow-y-auto flex-1">
                            {isLoading ? (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                    {[1, 2, 3, 4, 5, 6].map((i) => (
                                        <div key={i} className="bg-white dark:bg-dark-2 border border-gray-100 dark:border-dark-4 rounded-xl p-4 flex flex-col gap-3">
                                            <div className="flex items-start gap-3">
                                                <div className="w-16 h-16 rounded-lg bg-gray-200 dark:bg-dark-4 animate-pulse shrink-0"></div>
                                                <div className="flex-1 space-y-2 mt-1">
                                                    <div className="h-4 bg-gray-200 dark:bg-dark-4 rounded animate-pulse w-3/4"></div>
                                                    <div className="flex items-center gap-2 mt-2">
                                                        <div className="w-3 h-3 rounded-full bg-gray-200 dark:bg-dark-4 animate-pulse"></div>
                                                        <div className="h-3 bg-gray-200 dark:bg-dark-4 rounded animate-pulse w-1/2"></div>
                                                    </div>
                                                    <div className="h-4 bg-gray-200 dark:bg-dark-4 rounded animate-pulse w-1/4 mt-3"></div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : variants.length > 0 ? (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                    {variants.map((variant, index) => (
                                        <div key={index} className="bg-white dark:bg-dark-2 border border-gray-100 dark:border-dark-4 rounded-xl p-4 flex flex-col gap-3 hover:border-blue transition-colors relative group">
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
                                                    <div className="mt-2 text-sm font-bold text-blue">
                                                        ${variant.price}
                                                    </div>
                                                </div>
                                            </div>
                                            <button 
                                                onClick={() => handleRemoveVariant(variant.id)}
                                                className="absolute top-2 right-2 p-1.5 text-red/0 group-hover:text-red hover:bg-red/10 rounded-lg transition-all" 
                                                title="Remove from discount"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="flex flex-col items-center justify-center py-16 gap-3 opacity-50">
                                    <Tag className="w-12 h-12 text-slate-400" />
                                    <p className="text-sm font-bold text-dark-2 dark:text-meta-5">No variants in this discount</p>
                                </div>
                            )}
                        </div>

                        {/* Footer */}
                        <div className="flex justify-end gap-3 p-6 border-t border-gray-100 dark:border-dark-4 shrink-0 bg-gray-50/50 dark:bg-dark-2/30 rounded-b-2xl">
                            <button
                                onClick={onClose}
                                className="px-6 py-2.5 text-sm font-bold text-dark-2 dark:text-meta-5 bg-white dark:bg-dark-3 hover:bg-gray-50 dark:hover:bg-dark-4 rounded-xl transition-all active:scale-95 border border-gray-200 dark:border-dark-4"
                            >
                                Close
                            </button>
                            <button
                                onClick={() => setIsAddModalOpen(true)}
                                className="px-6 py-2.5 text-sm font-bold text-white bg-blue hover:bg-blue-dark rounded-xl transition-all active:scale-95 flex items-center gap-2 shadow-lg shadow-blue/20 dark:shadow-none"
                            >
                                <PackagePlus className="w-4 h-4" />
                                Add Product
                            </button>
                        </div>
                    </div>
                </div>,
                document.body
            )}

            <DiscountVariantsModal
                isOpen={isAddModalOpen}
                onClose={() => setIsAddModalOpen(false)}
                discount={discount}
                onSuccess={fetchDiscountVariants}
            />
        </>
    )
}
