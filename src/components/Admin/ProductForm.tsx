"use client";

import type { FC } from "react";
import { useEffect, useState } from "react";
import { X } from "lucide-react";
import type { Product, ProductFormData } from "@/types/productManagement";

interface ProductFormProps {
  isOpen: boolean;
  product?: Product;
  isLoading?: boolean;
  onSubmit: (data: ProductFormData) => Promise<void>;
  onClose: () => void;
}

const initialFormData: ProductFormData = {
  name: "",
  price: 0,
  stock: 0,
  category: "",
  imageUrl: "",
};

const categories = [
  "Electronics",
  "Computers",
  "Accessories",
  "Storage",
  "Furniture",
  "Other",
];

export const ProductForm: FC<ProductFormProps> = ({
  isOpen,
  product,
  isLoading = false,
  onSubmit,
  onClose,
}) => {
  const [formData, setFormData] = useState<ProductFormData>(initialFormData);
  const isEditing = !!product;

  // Initialize form with product data when editing
  useEffect(() => {
    if (isEditing && product) {
      const { id, createdAt, ...productData } = product;
      setFormData(productData);
    } else {
      setFormData(initialFormData);
    }
  }, [product, isEditing, isOpen]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    if (name === "price" || name === "stock") {
      setFormData(prev => ({
        ...prev,
        [name]: parseFloat(value) || 0,
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Basic validation
    if (!formData.name.trim()) {
      alert("Please enter product name");
      return;
    }

    if (formData.price <= 0) {
      alert("Price must be greater than 0");
      return;
    }

    if (formData.stock < 0) {
      alert("Stock cannot be negative");
      return;
    }

    if (!formData.category.trim()) {
      alert("Please select a category");
      return;
    }

    try {
      await onSubmit(formData);
      setFormData(initialFormData);
    } catch (error) {
      console.error("Form submission error:", error);
    }
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-40 bg-black/50 transition-opacity duration-300"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed left-1/2 top-1/2 z-50 w-full max-w-2xl -translate-x-1/2 -translate-y-1/2 transform rounded-lg bg-white p-6 shadow-lg dark:bg-slate-800">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">
            {isEditing ? "Edit Product" : "Add New Product"}
          </h2>
          <button
            onClick={onClose}
            disabled={isLoading}
            className="rounded-lg p-1 hover:bg-gray-100 disabled:opacity-50 dark:hover:bg-slate-700"
            aria-label="Close dialog"
          >
            <X size={20} className="text-gray-500 dark:text-gray-400" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Product Name */}
          <div>
            <label htmlFor="name" className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
              Product Name*
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              disabled={isLoading}
              placeholder="Enter product name"
              className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-gray-900 placeholder-gray-500 transition-colors focus:border-primary-600 focus:outline-none focus:ring-1 focus:ring-primary-600 disabled:bg-gray-100 dark:border-slate-600 dark:bg-slate-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-primary-500 dark:focus:ring-primary-500"
            />
          </div>

          {/* Price and Stock */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="price" className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                Price*
              </label>
              <input
                type="number"
                id="price"
                name="price"
                value={formData.price || ""}
                onChange={handleChange}
                disabled={isLoading}
                placeholder="0.00"
                step="0.01"
                min="0"
                className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-gray-900 placeholder-gray-500 transition-colors focus:border-primary-600 focus:outline-none focus:ring-1 focus:ring-primary-600 disabled:bg-gray-100 dark:border-slate-600 dark:bg-slate-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-primary-500 dark:focus:ring-primary-500"
              />
            </div>
            <div>
              <label htmlFor="stock" className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                Stock*
              </label>
              <input
                type="number"
                id="stock"
                name="stock"
                value={formData.stock || ""}
                onChange={handleChange}
                disabled={isLoading}
                placeholder="0"
                min="0"
                className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-gray-900 placeholder-gray-500 transition-colors focus:border-primary-600 focus:outline-none focus:ring-1 focus:ring-primary-600 disabled:bg-gray-100 dark:border-slate-600 dark:bg-slate-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-primary-500 dark:focus:ring-primary-500"
              />
            </div>
          </div>

          {/* Category */}
          <div>
            <label htmlFor="category" className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
              Category*
            </label>
            <select
              id="category"
              name="category"
              value={formData.category}
              onChange={handleChange}
              disabled={isLoading}
              className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-gray-900 transition-colors focus:border-primary-600 focus:outline-none focus:ring-1 focus:ring-primary-600 disabled:bg-gray-100 dark:border-slate-600 dark:bg-slate-700 dark:text-white dark:focus:border-primary-500 dark:focus:ring-primary-500"
            >
              <option value="">Select a category</option>
              {categories.map(cat => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          {/* Image URL */}
          <div>
            <label htmlFor="imageUrl" className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
              Image URL
            </label>
            <input
              type="text"
              id="imageUrl"
              name="imageUrl"
              value={formData.imageUrl}
              onChange={handleChange}
              disabled={isLoading}
              placeholder="/images/product/product-01.jpg"
              className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-gray-900 placeholder-gray-500 transition-colors focus:border-primary-600 focus:outline-none focus:ring-1 focus:ring-primary-600 disabled:bg-gray-100 dark:border-slate-600 dark:bg-slate-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-primary-500 dark:focus:ring-primary-500"
            />
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              disabled={isLoading}
              className="flex-1 rounded-lg border border-gray-300 bg-white px-4 py-2.5 font-medium text-gray-700 transition-colors hover:bg-gray-50 disabled:opacity-50 dark:border-slate-600 dark:bg-slate-700 dark:text-gray-300 dark:hover:bg-slate-600"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="flex-1 rounded-lg bg-primary-600 px-4 py-2.5 font-medium text-white transition-colors hover:bg-primary-700 disabled:opacity-50"
            >
              {isLoading
                ? isEditing
                  ? "Updating..."
                  : "Creating..."
                : isEditing
                  ? "Update Product"
                  : "Create Product"}
            </button>
          </div>
        </form>
      </div>
    </>
  );
};
