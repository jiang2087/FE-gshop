"use client"

import { Search } from "lucide-react"
import { useState, useEffect } from "react"
import { columns } from "./ProductTable/Column"
import { DataTable } from "./ProductTable/data-table"
import AddProductModal from "./ProductTable/AddProductModal"
import { createProduct } from "@/api/adminApi"
import { toast } from "react-hot-toast"

export default function AdminProductsManagement() {
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [searchQuery, setSearchQuery] = useState("")
    const [debouncedKeyword, setDebouncedKeyword] = useState("")

    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedKeyword(searchQuery)
        }, 500)

        return () => {
            clearTimeout(handler)
        }
    }, [searchQuery])

    const handleAddProduct = async (productData: any) => {
        const toastId = toast.loading("Creating product...")
        try {

            // console.log(productData)
            await createProduct(productData)
            toast.success("Product created successfully!", { id: toastId })
            window.location.reload()
        } catch (error) {
            toast.error("Failed to create product", { id: toastId })
        }
    }

    return (
        <div className="min-h-screen bg-white dark:bg-dark-2 rounded-xl py-10 px-4 sm:px-6 lg:px-8 transition-colors duration-300">
            <div className="max-w-7xl mx-auto">
                <div className="mb-6">
                    <h1 className="text-2xl font-black text-dark-2 dark:text-meta-5 tracking-tight">Product Management</h1>
                </div>

                <div className="mb-8 flex flex-col pb-5 pt-2 sm:flex-row items-center justify-between gap-4">
                    <div className="relative w-full max-w-md">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search products by name or brand"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-12 pr-4 py-3 bg-gray-2 dark:bg-dark-3 border-none rounded-2xl focus:ring-2 focus:ring-offset-0 focus:ring-gray-200 outline-none text-dark-2 dark:text-meta-5 font-medium transition-all"
                        />
                    </div>

                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="w-full sm:w-auto bg-gray-2 dark:bg-dark-4 hover:bg-dark-6 text-dark-2 dark:text-meta-5 px-8 py-3 rounded-2xl font-bold transition-all active:scale-95 flex items-center justify-center gap-2"
                    >
                        <span>+ Add New Product</span>
                    </button>
                </div>
                <DataTable columns={columns} keyword={debouncedKeyword} />
            </div>

            <AddProductModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onAdd={handleAddProduct}
            />
        </div>
    );
};
