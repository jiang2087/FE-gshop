"use client"

import { useState, useRef, useEffect } from "react"
import { X, Upload, DollarSign, Box, Palette, Image as ImageIcon, Edit, Plus, Info, Check } from "lucide-react"
import { toast } from "react-hot-toast"
import { getColors } from "@/api/adminApi"

interface ColorOption {
    id: number
    name: string
    hexCode: string
}

function isLightColor(hex: string): boolean {
    const c = hex.replace('#', '')
    const r = parseInt(c.substring(0, 2), 16)
    const g = parseInt(c.substring(2, 4), 16)
    const b = parseInt(c.substring(4, 6), 16)
    return (r * 299 + g * 587 + b * 114) / 1000 > 150
}

interface AddVariantsModalProps {
    isOpen: boolean
    onClose: () => void
    onAdd: (variant: any) => void
    productType?: string
    productName?: string
}

const AdditionalInfo = {
    laptop: [
        { key: "cpu", label: "CPU" },
        { key: "ram", label: "RAM" },
        { key: "storage", label: "Storage" },
        { key: "gpu", label: "GPU" },
        { key: "resolution", label: "Resolution" },
        { key: "screenSize", label: "Screen Size" },
    ],
    mobile: [
        { key: "ScreenSize", label: "Screen Size (inch)" },
        { key: "resolution", label: "Resolution" },
        { key: "camera", label: "Camera" },
        { key: "battery", label: "Battery" },
    ],
    watches: [
        { key: "gender", label: "Gender" },
        { key: "material", label: "Material" },
        { key: "batteryLife", label: "Battery Life (hours)" },
        { key: "gps", label: "GPS" },
    ],
    televisions: [
        { key: "screenSize", label: "Screen Size (inch)" },
        { key: "resolution", label: "Resolution" },
        { key: "refreshRate", label: "Refresh Rate (Hz)" },
        { key: "weight", label: "Weight (kg)" },
        { key: "warrantyMonths", label: "Warranty (months)" },
    ],
};

interface VariantFormProps {
    initialData?: any
    onSubmit: (data: any) => void
    onClose: () => void
    productType: string
    productName?: string
    title: string
    submitText: string
    icon: React.ReactNode
}

function VariantForm({ initialData, onSubmit, onClose, productType, productName, title, submitText, icon }: VariantFormProps) {
    const [formData, setFormData] = useState<any>({
        price: initialData?.price || "",
        stockQuantity: initialData?.stockQuantity || "",
        colorName: initialData?.color?.name || initialData?.colorName || "",
        hexCode: initialData?.color?.hexCode || initialData?.hexCode || "#000000",
        image: initialData?.image || "",
        isDefault: initialData?.isDefault || false,
    })
    const [dynamicFields, setDynamicFields] = useState<any>(initialData?.specifications || {})
    const [previewImage, setPreviewImage] = useState<string | null>(initialData?.image || null)
    const fileInputRef = useRef<HTMLInputElement>(null)
    const [colors, setColors] = useState<ColorOption[]>([])
    const [showCustomColor, setShowCustomColor] = useState(false)
    const [customColorName, setCustomColorName] = useState("")
    const [customHexCode, setCustomHexCode] = useState("#6366f1")

    useEffect(() => {
        // Fetch available colors from API
        getColors()
            .then((data: ColorOption[]) => setColors(data))
            .catch(() => setColors([]))

        if (initialData) {
            setFormData({
                price: initialData.price,
                stockQuantity: initialData.stockQuantity,
                colorName: initialData.color?.name || initialData.colorName,
                hexCode: initialData.color?.hexCode || initialData.hexCode,
                image: initialData.image,
                isDefault: initialData.isDefault,
            })
            setDynamicFields(initialData.specifications || {})
            setPreviewImage(initialData.image || null)
        } else {
            // Initialize dynamic fields based on product type for new variant
            const fields = AdditionalInfo[productType.toLowerCase()] || []
            const initialDynamicData = {}
            fields.forEach(field => {
                initialDynamicData[field.key] = ""
            })
            setDynamicFields(initialDynamicData)
        }
    }, [initialData, productType])

    const handleSelectColor = (color: ColorOption) => {
        setFormData(prev => ({ ...prev, colorName: color.name, hexCode: color.hexCode }))
        setShowCustomColor(false)
    }

    const handleAddCustomColor = () => {
        if (!customColorName.trim()) return
        const newColor: ColorOption = {
            id: Date.now(),
            name: customColorName.trim(),
            hexCode: customHexCode
        }
        setColors(prev => [...prev, newColor])
        setFormData(prev => ({ ...prev, colorName: newColor.name, hexCode: newColor.hexCode }))
        setCustomColorName("")
        setCustomHexCode("#6366f1")
        setShowCustomColor(false)
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target as HTMLInputElement
        if (name in formData) {
            setFormData(prev => ({
                ...prev,
                [name]: type === "checkbox" ? (e.target as HTMLInputElement).checked : value
            }))
        } else {
            setDynamicFields(prev => ({
                ...prev,
                [name]: value
            }))
        }
    }

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) {
            const imageUrl = URL.createObjectURL(file)
            setPreviewImage(imageUrl)
            setFormData(prev => ({ ...prev, image: `/assets/products/${file.name}` }))
        }
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        const fullData = {
            ...formData,
            specifications: dynamicFields
        }
        onSubmit(fullData)
    }

    const currentFields = AdditionalInfo[productType.toLowerCase()] || []

    return (
        <div
            className="bg-white dark:bg-dark-3 rounded-2xl shadow-2xl w-full max-w-2xl max-h-[85vh] flex flex-col transform transition-all animate-in zoom-in duration-300 cursor-default"
            onClick={(e) => e.stopPropagation()}
        >
            {/* Header */}
            <div className="flex-shrink-0 flex items-center justify-between p-6 border-b border-gray-100 dark:border-dark-4 bg-white dark:bg-dark-3 rounded-t-2xl z-10">
                <div className="flex items-center gap-3">
                    <div className="bg-indigo-100 dark:bg-indigo-900/30 p-2 rounded-lg">
                        {icon}
                    </div>
                    <div>
                        <h2 className="text-xl font-black text-dark-2 dark:text-meta-5">{title}</h2>
                        {productName && <p className="text-xs text-slate-400 font-medium">{productName}</p>}
                    </div>
                </div>
                <button
                    onClick={onClose}
                    className="p-2 hover:bg-gray-100 dark:hover:bg-dark-4 rounded-full transition-colors text-dark-2"
                >
                    <X className="h-6 w-6 text-dark-2 hover:text-red-500 transition-colors" />
                </button>
            </div>

            <form id="variant-form" onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
                {/* Common Variant Fields */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label className="text-sm font-bold text-dark-2 dark:text-red-light-6 flex items-center gap-2 mb-2">
                            <DollarSign className="h-4 w-4 text-emerald-500" /> Price
                        </label>
                        <input
                            required
                            type="number"
                            name="price"
                            value={formData.price}
                            onChange={handleChange}
                            placeholder="0.00"
                            className="w-full px-4 py-3 bg-gray-50 dark:bg-dark-2 rounded-xl border border-gray-200 dark:border-dark-4 focus:ring-2 focus:ring-indigo-500 outline-none text-dark-2 dark:text-meta-5 transition-all"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-bold text-dark-2 dark:text-red-light-6 flex items-center gap-2 mb-2">
                            <Box className="h-4 w-4 text-orange-500" /> Stock Quantity
                        </label>
                        <input
                            required
                            type="number"
                            name="stockQuantity"
                            value={formData.stockQuantity}
                            onChange={handleChange}
                            placeholder="0"
                            className="w-full px-4 py-3 bg-gray-50 dark:bg-dark-2 rounded-xl border border-gray-200 dark:border-dark-4 focus:ring-2 focus:ring-indigo-500 outline-none text-dark-2 dark:text-meta-5 transition-all"
                        />
                    </div>
                </div>

                {/* Color Picker */}
                <div className="space-y-2">
                    <label className="text-sm font-bold text-dark-2 dark:text-red-light-6 flex items-center gap-2 mb-2">
                        <Palette className="h-4 w-4 text-pink-500" /> Color
                    </label>
                    {/* Color swatches grid */}
                    <div className="flex flex-wrap gap-2">
                        {colors.map((color) => {
                            const isSelected = formData.colorName === color.name && formData.hexCode === color.hexCode
                            return (
                                <button
                                    key={color.id}
                                    type="button"
                                    title={`${color.name} (${color.hexCode})`}
                                    onClick={() => handleSelectColor(color)}
                                    className={`relative w-9 h-9 rounded-full border-2 transition-all duration-200 hover:scale-110 focus:outline-none ${
                                        isSelected
                                            ? 'border-indigo-500 ring-2 ring-indigo-300 dark:ring-indigo-700 scale-110'
                                            : 'border-gray-200 dark:border-dark-4 hover:border-gray-400'
                                    }`}
                                    style={{ backgroundColor: color.hexCode }}
                                >
                                    {isSelected && (
                                        <Check className="h-4 w-4 absolute inset-0 m-auto drop-shadow-md" style={{ color: isLightColor(color.hexCode) ? '#1e1e2e' : '#ffffff' }} />
                                    )}
                                </button>
                            )
                        })}
                        {/* Add custom color button */}
                        <button
                            type="button"
                            onClick={() => setShowCustomColor(!showCustomColor)}
                            title="Add custom color"
                            className={`w-9 h-9 rounded-full border-2 border-dashed transition-all duration-200 hover:scale-110 flex items-center justify-center ${
                                showCustomColor
                                    ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/30'
                                    : 'border-gray-300 dark:border-dark-4 bg-white dark:bg-dark-2 hover:border-indigo-400'
                            }`}
                        >
                            <Plus className={`h-4 w-4 transition-transform duration-200 ${showCustomColor ? 'rotate-45 text-indigo-500' : 'text-gray-400'}`} />
                        </button>
                    </div>

                    {/* Selected color label */}
                    {formData.colorName && (
                        <div className="flex items-center gap-2 mt-1">
                            <div className="w-3 h-3 rounded-full border border-gray-200 dark:border-dark-4" style={{ backgroundColor: formData.hexCode }} />
                            <span className="text-xs font-semibold text-dark-2 dark:text-meta-5">{formData.colorName}</span>
                            <span className="text-[10px] font-mono text-gray-400">{formData.hexCode}</span>
                        </div>
                    )}

                    {/* Custom color inline form */}
                    {showCustomColor && (
                        <div className="flex items-end gap-2 p-3 bg-white dark:bg-dark-2 rounded-xl border border-gray-200 dark:border-dark-4 animate-in slide-in-from-top-2 duration-200">
                            <input
                                type="color"
                                value={customHexCode}
                                onChange={(e) => setCustomHexCode(e.target.value)}
                                className="h-9 w-10 rounded-lg border border-gray-200 dark:border-dark-4 bg-white dark:bg-dark-3 p-0.5 cursor-pointer"
                            />
                            <input
                                type="text"
                                value={customColorName}
                                onChange={(e) => setCustomColorName(e.target.value)}
                                placeholder="Color name"
                                className="flex-1 min-w-0 px-3 py-2 text-xs bg-gray-50 dark:bg-dark-3 rounded-lg border border-gray-200 dark:border-dark-4 outline-none text-dark-2 dark:text-meta-5 focus:ring-1 focus:ring-indigo-500"
                                onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddCustomColor())}
                            />
                            <button
                                type="button"
                                onClick={handleAddCustomColor}
                                disabled={!customColorName.trim()}
                                className="px-3 py-2 text-xs font-bold bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 transition-colors disabled:opacity-40 disabled:cursor-not-allowed whitespace-nowrap"
                            >
                                Add
                            </button>
                        </div>
                    )}
                </div>

                {/* Image Upload */}
                <div className="space-y-2">
                    <label className="text-sm font-bold text-dark-2 dark:text-red-light-6 flex items-center gap-2 mb-2">
                        <ImageIcon className="h-4 w-4 text-purple-500" /> Variant Image
                    </label>
                    <div
                        onClick={() => fileInputRef.current?.click()}
                        className={`relative h-[52px] flex items-center justify-between px-4 bg-gray-50 dark:bg-dark-2 rounded-xl border border-dashed ${previewImage ? 'border-indigo-400' : 'border-gray-300 dark:border-dark-4'} cursor-pointer hover:bg-gray-100 dark:hover:bg-dark-4 transition-all`}
                    >
                        <div className="flex items-center gap-3 truncate mr-2">
                            {previewImage ? (
                                <img src={previewImage} alt="Preview" className="h-8 w-8 rounded-lg object-cover" />
                            ) : (
                                <Upload className="h-5 w-5 text-indigo-500" />
                            )}
                            <span className="text-sm text-dark-2 truncate">
                                {formData.image ? formData.image.split('/').pop() : "Upload variant image..."}
                            </span>
                        </div>
                        <input
                            type="file"
                            ref={fileInputRef}
                            onChange={handleImageChange}
                            accept="image/*"
                            className="hidden"
                        />
                        <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400">Browse</span>
                    </div>
                </div>

                {/* Dynamic Fields Section */}
                {currentFields.length > 0 && (
                    <div className="pt-4 border-t border-gray-100 dark:border-dark-4">
                        <h3 className="text-sm font-bold text-dark-2 dark:text-meta-5 flex items-center gap-2 mb-4">
                            <Info className="h-4 w-4 text-indigo-500" /> Specific Specifications ({productType})
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {currentFields.map((field) => (
                                <div key={field.key} className="space-y-1">
                                    <label className="text-xs font-bold text-gray-500 dark:text-slate-400">{field.label}</label>
                                    <input
                                        type="text"
                                        name={field.key}
                                        value={dynamicFields[field.key] || ""}
                                        onChange={handleChange}
                                        placeholder={`Enter ${field.label.toLowerCase()}`}
                                        className="w-full px-3 py-2 bg-gray-50 dark:bg-dark-2 rounded-lg border border-gray-100 dark:border-dark-4 focus:ring-2 focus:ring-indigo-500 outline-none text-sm text-dark-2 dark:text-meta-5 transition-all"
                                    />
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                <div className="flex items-center gap-2">
                    <input
                        type="checkbox"
                        id="isDefault"
                        name="isDefault"
                        checked={formData.isDefault}
                        onChange={handleChange}
                        className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                    />
                    <label htmlFor="isDefault" className="text-sm font-medium text-dark-2 dark:text-meta-5">
                        Set as default variant for this product
                    </label>
                </div>
            </form>

            {/* Footer Actions */}
            <div className="flex-shrink-0 flex justify-end gap-3 p-6 border-t border-gray-100 dark:border-dark-4 bg-gray-50 dark:bg-dark-2 rounded-b-2xl">
                <button
                    type="button"
                    onClick={onClose}
                    className="px-6 py-2.5 text-sm font-bold text-dark-2 dark:text-meta-5 bg-gray-100 hover:bg-gray-200 dark:bg-dark-3 dark:hover:bg-dark-4 rounded-xl transition-all"
                >
                    Cancel
                </button>
                <button
                    type="submit"
                    form="variant-form"
                    className="px-6 py-2.5 text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-lg shadow-indigo-200 dark:shadow-none transition-all active:scale-95"
                >
                    {submitText}
                </button>
            </div>
        </div>
    )
}

export default function AddVariantsModal({ isOpen, onClose, onAdd, productType = "laptop", productName }: AddVariantsModalProps) {
    if (!isOpen) return null

    const handleAdd = (data: any) => {
        onAdd(data)
        toast.success("New variant added successfully!")
        onClose()
    }

    return (
        <div
            className="fixed inset-0 z-50 flex items-start justify-center bg-black/60 backdrop-blur-sm p-4 pt-24 overflow-y-auto cursor-pointer"
            onClick={onClose}
        >
            <VariantForm
                title="Add New Variant"
                submitText="Add Variant"
                icon={<Plus className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />}
                onSubmit={handleAdd}
                onClose={onClose}
                productType={productType}
                productName={productName}
            />
        </div>
    )
}

interface EditVariantsModalProps {
    isOpen: boolean
    onClose: () => void
    onUpdate: (variant: any) => void
    variant: any
    productType?: string
    productName?: string
}

export function EditVariantsModal({ isOpen, onClose, onUpdate, variant, productType = "laptop", productName }: EditVariantsModalProps) {
    if (!isOpen) return null

    const handleUpdate = (data: any) => {
        onUpdate({ ...variant, ...data })
        toast.success("Variant updated successfully!")
        onClose()
    }

    return (
        <div
            className="fixed inset-0 z-50 flex items-start justify-center bg-black/60 backdrop-blur-sm p-4 pt-24 overflow-y-auto cursor-pointer"
            onClick={onClose}
        >
            <VariantForm
                initialData={variant}
                title="Edit Variant"
                submitText="Update Variant"
                icon={<Edit className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />}
                onSubmit={handleUpdate}
                onClose={onClose}
                productType={productType}
                productName={productName}
            />
        </div>
    )
}
