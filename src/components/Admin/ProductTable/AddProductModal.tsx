import { useState, useRef, useEffect } from "react"
import { createPortal } from "react-dom"
import { X, Upload, Package, Type, Hash, FileText, Edit, DollarSign, Box, Palette, CheckCircle, Image as ImageIcon, Plus, Check, Cpu, HardDrive, Monitor, Smartphone, Watch, Tv, Ruler } from "lucide-react"
import { getColors, deleteColor } from "@/api/adminApi"
import { toast } from "react-hot-toast"

interface ColorOption {
    id: number
    name: string
    hexCode: string
}

// Helper to determine if a hex color is light (for contrast on check icon)
function isLightColor(hex: string): boolean {
    const c = hex.replace('#', '')
    const r = parseInt(c.substring(0, 2), 16)
    const g = parseInt(c.substring(2, 4), 16)
    const b = parseInt(c.substring(4, 6), 16)
    // Using perceived luminance formula
    return (r * 299 + g * 587 + b * 114) / 1000 > 150
}

// Product-type-specific fields configuration
interface SpecField {
    key: string
    label: string
    type: 'text' | 'number' | 'boolean'
    placeholder?: string
    suffix?: string
    icon: React.ReactNode
}

const PRODUCT_TYPE_FIELDS: Record<string, SpecField[]> = {
    LAPTOP: [
        { key: 'cpu', label: 'CPU', type: 'text', placeholder: 'e.g. Intel i7-13700H', icon: <Cpu className="h-4 w-4 text-blue-500" /> },
        { key: 'ram', label: 'RAM', type: 'text', placeholder: 'e.g. 16GB DDR5', icon: <HardDrive className="h-4 w-4 text-green-500" /> },
        { key: 'storage', label: 'Storage', type: 'text', placeholder: 'e.g. 512GB SSD', icon: <HardDrive className="h-4 w-4 text-amber-500" /> },
        { key: 'gpu', label: 'GPU', type: 'text', placeholder: 'e.g. RTX 4060', icon: <Monitor className="h-4 w-4 text-purple-500" /> },
        { key: 'screenSize', label: 'Screen Size (inch)', type: 'number', placeholder: 'e.g. 15.6', icon: <Monitor className="h-4 w-4 text-cyan-500" /> },
        { key: 'resolution', label: 'Resolution', type: 'text', placeholder: 'e.g. 1920x1080', icon: <Monitor className="h-4 w-4 text-indigo-500" /> },
        { key: 'dimension', label: 'Dimension', type: 'text', placeholder: 'e.g. 35.7 x 23.5 x 1.8 cm', icon: <Ruler className="h-4 w-4 text-slate-500" /> },
    ],
    MOBILE: [
        { key: 'model', label: 'Model', type: 'text', placeholder: 'e.g. iPhone 15 Pro', icon: <Smartphone className="h-4 w-4 text-blue-500" /> },
        { key: 'screenSize', label: 'Screen Size (inch)', type: 'number', placeholder: 'e.g. 6.7', icon: <Monitor className="h-4 w-4 text-cyan-500" /> },
        { key: 'resolution', label: 'Resolution', type: 'text', placeholder: 'e.g. 2796x1290', icon: <Monitor className="h-4 w-4 text-indigo-500" /> },
        { key: 'camera', label: 'Camera', type: 'text', placeholder: 'e.g. 48MP + 12MP', icon: <Smartphone className="h-4 w-4 text-pink-500" /> },
        { key: 'battery', label: 'Battery', type: 'text', placeholder: 'e.g. 4422 mAh', icon: <Smartphone className="h-4 w-4 text-green-500" /> },
        { key: 'dimension', label: 'Dimensions', type: 'text', placeholder: 'e.g. 159.9 x 76.7 x 8.3 mm', icon: <Ruler className="h-4 w-4 text-slate-500" /> },
    ],
    WATCHES: [
        { key: 'model', label: 'Model', type: 'text', placeholder: 'e.g. Galaxy Watch 6', icon: <Watch className="h-4 w-4 text-blue-500" /> },
        { key: 'gender', label: 'Gender', type: 'text', placeholder: 'e.g. Unisex, Men, Women', icon: <Watch className="h-4 w-4 text-pink-500" /> },
        { key: 'material', label: 'Material', type: 'text', placeholder: 'e.g. Stainless Steel', icon: <Watch className="h-4 w-4 text-amber-500" /> },
        { key: 'batteryLife', label: 'Battery Life (hours)', type: 'number', placeholder: 'e.g. 40', icon: <Watch className="h-4 w-4 text-green-500" /> },
        { key: 'gps', label: 'GPS', type: 'boolean', placeholder: '', icon: <Watch className="h-4 w-4 text-indigo-500" /> },
    ],
    TELEVISION: [
        { key: 'screenSize', label: 'Screen Size (inch)', type: 'number', placeholder: 'e.g. 55', icon: <Tv className="h-4 w-4 text-cyan-500" /> },
        { key: 'resolution', label: 'Resolution', type: 'text', placeholder: 'e.g. 3840x2160 (4K)', icon: <Tv className="h-4 w-4 text-indigo-500" /> },
        { key: 'refreshRate', label: 'Refresh Rate (Hz)', type: 'number', placeholder: 'e.g. 120', icon: <Tv className="h-4 w-4 text-purple-500" /> },
        { key: 'weight', label: 'Weight (kg)', type: 'number', placeholder: 'e.g. 12.5', icon: <Tv className="h-4 w-4 text-amber-500" /> },
        { key: 'warrantyMonths', label: 'Warranty (months)', type: 'number', placeholder: 'e.g. 24', icon: <Tv className="h-4 w-4 text-green-500" /> },
    ],
}

interface ProductFormProps {
    initialData?: any
    onSubmit: (data: any) => void
    onCancel: () => void
    title: string
    submitLabel: string
    icon: React.ReactNode
}

// Helper: build initial form state from product data
function getInitialFormData(initialData?: any) {
    if (!initialData) {
        return {
            productType: "LAPTOP",
            brand: "",
            thumbnail: "",
            name: "",
            description: "",
            colorName: "Black",
            hexCode: "#000000",
            price: 0,
            stockQuantity: 0,
            isDefault: true,
            active: true,
            attributes: [] as any[]
        }
    }

    const defaultVariant = initialData.productVariants?.find((v: any) => v.isDefault) || initialData.productVariants?.[0]

    // Robust product type normalization
    const rawType = (initialData.productType || initialData.category || initialData.type || "LAPTOP").toString().toUpperCase().trim();
    let productType = rawType;

    // Map common aliases and singular/plural forms
    const typeMap: Record<string, string> = {
        "LAPTOP": "LAPTOP",
        "LAPTOPS": "LAPTOP",
        "MOBILE": "MOBILE",
        "MOBILES": "MOBILE",
        "PHONE": "MOBILE",
        "SMARTPHONE": "MOBILE",
        "WATCH": "WATCHES",
        "WATCHES": "WATCHES",
        "TV": "TELEVISION",
        "TELEVISION": "TELEVISION",
        "TELEVISIONS": "TELEVISION"
    };

    productType = typeMap[productType] || productType;

    // Fallback if not in our configuration
    if (!PRODUCT_TYPE_FIELDS[productType]) {
        // Try to find a partial match or default to LAPTOP
        const keys = Object.keys(PRODUCT_TYPE_FIELDS);
        const match = keys.find(k => productType.includes(k) || k.includes(productType));
        productType = match || "LAPTOP";
    }

    const specFields = PRODUCT_TYPE_FIELDS[productType] || []
    const specData: Record<string, any> = {}

    // Extract values from attributes array (case-insensitive key matching)
    if (initialData.attributes && Array.isArray(initialData.attributes)) {
        initialData.attributes.forEach((attr: any) => {
            const field = specFields.find(f => f.key.toLowerCase() === attr.key.toLowerCase());
            if (field) {
                specData[field.key] = attr.value;
            } else {
                specData[attr.key] = attr.value;
            }
        })
    }

    // Check top-level properties (case-insensitive)
    specFields.forEach((field: SpecField) => {
        // Try exact match first
        if (initialData[field.key] !== undefined) {
            specData[field.key] = initialData[field.key];
        } else {
            // Try case-insensitive top-level match
            const topKey = Object.keys(initialData).find(k => k.toLowerCase() === field.key.toLowerCase());
            if (topKey && initialData[topKey] !== undefined) {
                specData[field.key] = initialData[topKey];
            }
        }
    })

    return {
        productType,
        brand: initialData.brand || "",
        thumbnail: initialData.thumbnail || "",
        name: initialData.name || "",
        description: initialData.description || "",
        colorName: defaultVariant?.color?.name || defaultVariant?.colorName || "",
        hexCode: defaultVariant?.color?.hexCode || defaultVariant?.hexCode || "#000000",
        price: defaultVariant?.price || 0,
        stockQuantity: defaultVariant?.stockQuantity || 0,
        isDefault: defaultVariant?.isDefault !== undefined ? defaultVariant.isDefault : true,
        active: initialData.active !== undefined ? initialData.active : true,
        attributes: initialData.attributes || [],
        ...specData
    }
}

function ProductForm({ initialData, onSubmit, onCancel, title, submitLabel, icon }: ProductFormProps) {
    const [mounted, setMounted] = useState(false)
    const [formData, setFormData] = useState(() => {
        const initial = getInitialFormData(initialData);
        // Separating dynamic fields from base form data
        return initial;
    })

    // Extract dynamic fields into a separate state for easier management
    const [dynamicFields, setDynamicFields] = useState<Record<string, any>>(() => {
        const initial = getInitialFormData(initialData);
        const dynamic: Record<string, any> = {};
        const allSpecKeys = Object.values(PRODUCT_TYPE_FIELDS).flat().map(f => f.key);

        Object.keys(initial).forEach(key => {
            if (allSpecKeys.includes(key)) {
                dynamic[key] = initial[key];
            }
        });
        return dynamic;
    });

    const [previewImage, setPreviewImage] = useState<string | null>(initialData?.thumbnail || null)
    const fileInputRef = useRef<HTMLInputElement>(null)
    const [colors, setColors] = useState<ColorOption[]>([])
    const [showCustomColor, setShowCustomColor] = useState(false)
    const [customColorName, setCustomColorName] = useState("")
    const [customHexCode, setCustomHexCode] = useState("#6366f1")

    // Fetch colors on mount
    useEffect(() => {
        setMounted(true)
        getColors()
            .then((data: ColorOption[]) => setColors(data))
            .catch(() => setColors([]))
    }, [])

    // Sync formData khi initialData thay đổi (ví dụ mở modal với product khác)
    useEffect(() => {
        if (initialData) {
            const initial = getInitialFormData(initialData);
            setFormData(initial)
            setPreviewImage(initialData.thumbnail || null)

            // Sync dynamic fields
            const dynamic: Record<string, any> = {};
            const allSpecKeys = Object.values(PRODUCT_TYPE_FIELDS).flat().map(f => f.key);
            Object.keys(initial).forEach(key => {
                if (allSpecKeys.includes(key)) {
                    dynamic[key] = initial[key];
                }
            });
            setDynamicFields(dynamic);
        }
    }, [initialData])

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

    const handleDeleteColor = async (e: React.MouseEvent, colorId: number) => {
        e.stopPropagation()
        if (window.confirm("Are you sure you want to delete this color?")) {
            try {
                await deleteColor(colorId)
                setColors(prev => prev.filter(c => c.id !== colorId))
                toast.success("Color deleted successfully")
                // Reset form data if the deleted color was selected
                const deletedColor = colors.find(c => c.id === colorId)
                if (deletedColor && formData.colorName === deletedColor.name && formData.hexCode === deletedColor.hexCode) {
                    setFormData(prev => ({ ...prev, colorName: "", hexCode: "#000000" }))
                }
            } catch (error) {
                console.error("Error deleting color:", error)
                toast.error("Failed to delete color")
            }
        }
    }

    if (!mounted) return null

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target
        const finalValue = type === 'checkbox' ? (e.target as HTMLInputElement).checked : (type === 'number' ? Number(value) : value)

        // Check if it's a dynamic field or base field
        const allSpecKeys = Object.values(PRODUCT_TYPE_FIELDS).flat().map(f => f.key);
        if (allSpecKeys.includes(name)) {
            setDynamicFields(prev => ({ ...prev, [name]: finalValue }))
        } else {
            setFormData(prev => ({ ...prev, [name]: finalValue }))
        }
    }

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) {
            const imageUrl = URL.createObjectURL(file)
            setPreviewImage(imageUrl)
            setFormData(prev => ({ ...prev, thumbnail: `/assets/products/${file.name}` }))
        }
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()

        const currentSpecFields = PRODUCT_TYPE_FIELDS[formData.productType] || []

        // Transform dynamic fields into attributes array format [{key, value}]
        const attributes = currentSpecFields
            .map(field => ({
                key: field.key,
                value: dynamicFields[field.key]
            }))
            .filter(attr => attr.value !== undefined && attr.value !== "" && attr.value !== null)

        // Create final data for submission
        const dataToSubmit = {
            ...formData,
            attributes
        }

        // Clean up any flat spec fields that might have leaked into formData
        Object.values(PRODUCT_TYPE_FIELDS).flat().forEach(field => {
            delete (dataToSubmit as any)[field.key]
        })

        onSubmit(dataToSubmit)
    }

    // Get the spec fields for the currently selected product type
    const currentSpecFields = PRODUCT_TYPE_FIELDS[formData.productType] || []

    return createPortal(
        <div
            className="fixed inset-0 z-[100] flex items-start justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto pt-10"
            onClick={onCancel}
        >
            <div
                className="bg-white dark:bg-dark-3 rounded-2xl shadow-2xl w-full max-w-4xl transform transition-all animate-in zoom-in duration-300 my-8"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-100 dark:border-dark-4">
                    <div className="flex items-center gap-3">
                        <div className="bg-indigo-100 dark:bg-indigo-900/30 p-2 rounded-lg">
                            {icon}
                        </div>
                        <h2 className="text-xl font-black text-dark-2 dark:text-meta-5">{title}</h2>
                    </div>
                    <button
                        onClick={onCancel}
                        className="p-2 hover:bg-gray-100 dark:hover:bg-dark-4 rounded-full transition-colors text-dark-2"
                    >
                        <X className="h-6 w-6 text-dark-2 hover:text-red-500 transition-colors" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-8">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {/* Basic Info Section */}
                        <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="md:col-span-2 flex items-center gap-2 pb-2 border-b border-gray-100 dark:border-dark-4 mb-2">
                                <Package className="h-5 w-5 text-indigo-600" />
                                <h3 className="font-bold text-dark-2 dark:text-meta-5 uppercase tracking-wider text-sm">Product Information</h3>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-bold text-dark-2 dark:text-red-light-6 flex items-center gap-2">
                                    <Type className="h-4 w-4 text-blue-500" /> Product Name
                                </label>
                                <input
                                    required
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    placeholder="Enter product name"
                                    className="w-full px-4 py-3 bg-gray-50 dark:bg-dark-2 rounded-xl border border-gray-200 dark:border-dark-4 focus:ring-2 focus:ring-indigo-500 outline-none text-dark-2 dark:text-meta-5 transition-all"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-bold text-dark-2 dark:text-red-light-6 flex items-center gap-2">
                                    <Hash className="h-4 w-4 text-amber-500" /> Brand
                                </label>
                                <input
                                    required
                                    type="text"
                                    name="brand"
                                    value={formData.brand}
                                    onChange={handleChange}
                                    placeholder="e.g. Apple, Sony, Dell"
                                    className="w-full px-4 py-3 bg-gray-50 dark:bg-dark-2 rounded-xl border border-gray-200 dark:border-dark-4 focus:ring-2 focus:ring-indigo-500 outline-none text-dark-2 dark:text-meta-5 transition-all"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-bold text-dark-2 dark:text-red-light-6 flex items-center gap-2">
                                    <Package className="h-4 w-4 text-indigo-500" /> Product Type
                                </label>
                                <select
                                    name="productType"
                                    value={formData.productType}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 bg-gray-50 dark:bg-dark-2 rounded-xl border border-gray-200 dark:border-dark-4 focus:ring-2 focus:ring-indigo-500 outline-none text-dark-2 dark:text-meta-5 transition-all appearance-none cursor-pointer"
                                >
                                    <option value="LAPTOP">Laptop</option>
                                    <option value="WATCHES">Watch</option>
                                    <option value="MOBILE">Mobile</option>
                                    <option value="TELEVISION">Television</option>
                                </select>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-bold text-dark-2 dark:text-red-light-6 flex items-center gap-2">
                                    <ImageIcon className="h-4 w-4 text-purple-500" /> Thumbnail Image
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
                                            {formData.thumbnail ? formData.thumbnail.split('/').pop() : "Upload image..."}
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
                        </div>

                        {/* Variant Info Section */}
                        <div className="space-y-6 bg-gray-50/50 dark:bg-dark-2/30 p-4 rounded-2xl border border-gray-100 dark:border-dark-4">
                            <div className="flex items-center gap-2 pb-2 border-b border-gray-100 dark:border-dark-4 mb-2">
                                <Palette className="h-5 w-5 text-pink-500" />
                                <h3 className="font-bold text-dark-2 dark:text-meta-5 uppercase tracking-wider text-sm">Initial Variant</h3>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-bold text-dark-2 dark:text-red-light-6 flex items-center gap-2">
                                    <Palette className="h-4 w-4 text-pink-500" /> Color
                                </label>
                                {/* Color swatches grid */}
                                <div className="flex flex-wrap gap-2">
                                    {colors.map((color) => {
                                        const isSelected = formData.colorName === color.name && formData.hexCode === color.hexCode
                                        return (
                                            <div key={color.id} className="relative group">
                                                <button
                                                    key={color.id}
                                                    type="button"
                                                    title={`${color.name} (${color.hexCode})`}
                                                    onClick={() => handleSelectColor(color)}
                                                    className={`relative w-9 h-9 rounded-full border-2 transition-all duration-200 hover:scale-110 focus:outline-none ${isSelected
                                                        ? 'border-indigo-500 ring-2 ring-indigo-300 dark:ring-indigo-700 scale-110'
                                                        : 'border-gray-200 dark:border-dark-4 hover:border-gray-400'
                                                        }`}
                                                    style={{ backgroundColor: color.hexCode }}
                                                >
                                                    {isSelected && (
                                                        <Check className="h-4 w-4 absolute inset-0 m-auto drop-shadow-md" style={{ color: isLightColor(color.hexCode) ? '#1e1e2e' : '#ffffff' }} />
                                                    )}
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={(e) => handleDeleteColor(e, color.id)}
                                                    className="absolute -top-1 -right-1 w-4 h-4 bg-red-light-5 hover:bg-dark hover:text-white text-dark rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600 z-10"
                                                    title="Delete color"
                                                >
                                                    <X className="h-2.5 w-2.5 text-red-dark" />
                                                </button>
                                            </div>
                                        )
                                    })}
                                    {/* Add custom color button */}
                                    <button
                                        type="button"
                                        onClick={() => setShowCustomColor(!showCustomColor)}
                                        title="Add custom color"
                                        className={`w-9 h-9 rounded-full border-2 border-dashed transition-all duration-200 hover:scale-110 flex items-center justify-center ${showCustomColor
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

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-dark-2 dark:text-red-light-6 flex items-center gap-2">
                                        <DollarSign className="h-4 w-4 text-emerald-500" /> Price
                                    </label>
                                    <input
                                        required
                                        type="number"
                                        name="price"
                                        min="0"
                                        step="0.01"
                                        value={formData.price}
                                        onChange={handleChange}
                                        className="w-full px-4 py-2.5 bg-white dark:bg-dark-2 rounded-xl border border-gray-200 dark:border-dark-4 focus:ring-2 focus:ring-indigo-500 outline-none text-dark-2 dark:text-meta-5"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-dark-2 dark:text-red-light-6 flex items-center gap-2">
                                        <Box className="h-4 w-4 text-orange-500" /> Stock
                                    </label>
                                    <input
                                        required
                                        type="number"
                                        name="stockQuantity"
                                        min="0"
                                        value={formData.stockQuantity}
                                        onChange={handleChange}
                                        className="w-full px-4 py-2.5 bg-white dark:bg-dark-2 rounded-xl border border-gray-200 dark:border-dark-4 focus:ring-2 focus:ring-indigo-500 outline-none text-dark-2 dark:text-meta-5"
                                    />
                                </div>
                            </div>

                            <div className="flex flex-col gap-4 pt-2">
                                <label className="flex items-center justify-between p-3 bg-white dark:bg-dark-3 rounded-xl border border-gray-100 dark:border-dark-4 cursor-pointer group hover:border-green-light transition-all">
                                    <div className="flex items-center gap-3">
                                        <div className={`p-2 rounded-lg ${formData.isDefault ? 'bg-green-light/20 text-green-light' : 'bg-gray-2 text-gray-400'}`}>
                                            <CheckCircle className="h-4 w-4" />
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="text-sm font-bold text-dark-2 dark:text-meta-5">Default Variant</span>
                                            <span className="text-[10px] text-gray-400">Set as primary option</span>
                                        </div>
                                    </div>
                                    <div className="relative inline-flex items-center cursor-pointer">
                                        <input
                                            type="checkbox"
                                            name="isDefault"
                                            checked={formData.isDefault}
                                            onChange={handleChange}
                                            className="sr-only peer"
                                        />
                                        <div className="w-11 h-6 bg-gray-2 peer-focus:outline-none rounded-full peer dark:bg-dark-4 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-green-light"></div>
                                    </div>
                                </label>

                                <label className="flex items-center justify-between p-3 bg-white dark:bg-dark-3 rounded-xl border border-gray-100 dark:border-dark-4 cursor-pointer group hover:border-green-light transition-all">
                                    <div className="flex items-center gap-3">
                                        <div className={`p-2 rounded-lg ${formData.active ? 'bg-green-light/20 text-green-light' : 'bg-gray-2 text-gray-400'}`}>
                                            <CheckCircle className="h-4 w-4" />
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="text-sm font-bold text-dark-2 dark:text-meta-5">Active Product</span>
                                            <span className="text-[10px] text-gray-400">Visible to customers</span>
                                        </div>
                                    </div>
                                    <div className="relative inline-flex items-center cursor-pointer">
                                        <input
                                            type="checkbox"
                                            name="active"
                                            checked={formData.active}
                                            onChange={handleChange}
                                            className="sr-only peer"
                                        />
                                        <div className="w-11 h-6 bg-gray-2 peer-focus:outline-none rounded-full peer dark:bg-dark-4 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-green-light"></div>
                                    </div>
                                </label>
                            </div>
                        </div>
                    </div>

                    {/* Product Type Specifications */}
                    {currentSpecFields.length > 0 && (
                        <div className="space-y-4">
                            <div className="flex items-center gap-2 pb-2 border-b border-gray-100 dark:border-dark-4">
                                <FileText className="h-5 w-5 text-teal-500" />
                                <h3 className="font-bold text-dark-2 dark:text-meta-5 uppercase tracking-wider text-sm">
                                    {formData.productType.charAt(0) + formData.productType.slice(1).toLowerCase()} Specifications
                                </h3>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {currentSpecFields.map((field) => (
                                    <div key={field.key} className="space-y-1.5">
                                        <label className="text-xs font-bold text-dark-2 dark:text-red-light-6 flex items-center gap-1.5">
                                            {field.icon} {field.label}
                                        </label>
                                        {field.type === 'boolean' ? (
                                            <label className="flex items-center justify-between p-2.5 bg-gray-50 dark:bg-dark-2 rounded-xl border border-gray-200 dark:border-dark-4 cursor-pointer hover:border-green-light transition-all">
                                                <span className="text-xs font-semibold text-dark-2 dark:text-meta-5">
                                                    {!!dynamicFields[field.key] ? 'Yes' : 'No'}
                                                </span>
                                                <div className="relative inline-flex items-center cursor-pointer">
                                                    <input
                                                        type="checkbox"
                                                        name={field.key}
                                                        checked={!!dynamicFields[field.key]}
                                                        onChange={handleChange}
                                                        className="sr-only peer"
                                                    />
                                                    <div className="w-9 h-5 bg-gray-2 peer-focus:outline-none rounded-full peer dark:bg-dark-4 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all dark:border-gray-600 peer-checked:bg-green-light"></div>
                                                </div>
                                            </label>
                                        ) : (
                                            <input
                                                type={field.type}
                                                name={field.key}
                                                value={dynamicFields[field.key] ?? ''}
                                                onChange={handleChange}
                                                placeholder={field.placeholder}
                                                step={field.type === 'number' ? '0.1' : undefined}
                                                className="w-full px-3 py-2.5 text-sm bg-gray-50 dark:bg-dark-2 rounded-xl border border-gray-200 dark:border-dark-4 focus:ring-2 focus:ring-indigo-500 outline-none text-dark-2 dark:text-meta-5 transition-all"
                                            />
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Description Field */}
                    <div className="space-y-2">
                        <label className="text-sm font-bold text-dark-2 dark:text-red-light-6 flex items-center gap-2">
                            <FileText className="h-4 w-4 text-slate-500" /> Description
                        </label>
                        <textarea
                            required
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            placeholder="Describe the product details..."
                            rows={3}
                            className="w-full px-4 py-3 bg-gray-50 dark:bg-dark-2 rounded-xl border border-gray-200 dark:border-dark-4 focus:ring-2 focus:ring-indigo-500 outline-none text-dark-2 dark:text-meta-5 transition-all resize-none"
                        />
                    </div>

                    {/* Footer Actions */}
                    <div className="flex justify-end gap-3 pt-6 border-t border-gray-100 dark:border-dark-4">
                        <button
                            type="button"
                            onClick={onCancel}
                            className="px-8 py-3 text-sm font-bold text-dark-2 dark:text-meta-5 bg-gray-2 dark:bg-dark-3 hover:bg-gray-3 dark:hover:bg-dark-4 rounded-xl transition-all active:scale-95 border border-gray-200 dark:border-dark-4"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-8 py-3 text-sm font-bold text-dark-2 dark:text-meta-5 bg-gray-2 dark:bg-dark-3 hover:bg-gray-3 dark:hover:bg-dark-4 rounded-xl shadow-lg shadow-gray-200 dark:shadow-none transition-all active:scale-95 border border-gray-200 dark:border-dark-4"
                        >
                            {submitLabel}
                        </button>
                    </div>
                </form>
            </div>
        </div>,
        document.body
    )
}

interface AddProductModalProps {
    isOpen: boolean
    onClose: () => void
    onAdd: (product: any) => void
}

export default function AddProductModal({ isOpen, onClose, onAdd }: AddProductModalProps) {
    if (!isOpen) return null

    return (
        <ProductForm
            title="Add New Product"
            submitLabel="Create Product"
            icon={<Package className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />}
            onSubmit={onAdd}
            onCancel={onClose}
        />
    )
}

interface EditProductModalProps {
    isOpen: boolean
    onClose: () => void
    onUpdate: (product: any) => void
    product: any
}

export function EditProductModal({ isOpen, onClose, onUpdate, product }: EditProductModalProps) {
    if (!isOpen) return null

    return (
        <ProductForm
            title="Edit Product"
            submitLabel="Save Changes"
            initialData={product}
            icon={<Edit className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />}
            onSubmit={onUpdate}
            onCancel={onClose}
        />
    )
}

