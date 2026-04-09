"use client";

import type { FC } from "react";
import { useMemo, useState } from "react";
import { ChevronLeft, ChevronRight, Edit2, Trash2 } from "lucide-react";
import type { Product } from "@/types/productManagement";

interface ProductTableProps {
  products: Product[];
  isLoading?: boolean;
  sortBy?: "name" | "price" | "stock" | "createdAt";
  sortOrder?: "asc" | "desc";
  currentPage: number;
  totalPages: number;
  onEdit: (product: Product) => void;
  onDelete: (product: Product) => void;
  onPageChange: (page: number) => void;
  onSort?: (field: "name" | "price" | "stock" | "createdAt") => void;
}

export const ProductTable: FC<ProductTableProps> = ({
  products,
  isLoading = false,
  sortBy,
  sortOrder = "asc",
  currentPage,
  totalPages,
  onEdit,
  onDelete,
  onPageChange,
  onSort,
}) => {
  const [hoveredRow, setHoveredRow] = useState<string | null>(null);

  // Sort products
  const sortedProducts = useMemo(() => {
    if (!sortBy || !onSort) return products;

    return [...products].sort((a, b) => {
      let aValue: string | number | Date = a[sortBy as keyof Product];
      let bValue: string | number | Date = b[sortBy as keyof Product];

      if (typeof aValue === "string") {
        aValue = aValue.toLowerCase();
        bValue = (bValue as string).toLowerCase();
      }

      if (aValue < bValue) return sortOrder === "asc" ? -1 : 1;
      if (aValue > bValue) return sortOrder === "asc" ? 1 : -1;
      return 0;
    });
  }, [products, sortBy, sortOrder, onSort]);

  const SortIcon = ({ field }: { field: string }) => {
    if (sortBy !== field) {
      return <span className="opacity-30">↕</span>;
    }
    return <span className="text-primary-600">{sortOrder === "asc" ? "↑" : "↓"}</span>;
  };

  const formatPrice = (price: number): string => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(price);
  };

  const formatDate = (date: Date): string => {
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    }).format(new Date(date));
  };

  const getStockStatus = (stock: number): string => {
    if (stock > 20) return "In Stock";
    if (stock > 0) return "Low Stock";
    return "Out of Stock";
  };

  const getStockColor = (stock: number): string => {
    if (stock > 20) return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
    if (stock > 0) return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200";
    return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200";
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-200 border-t-primary-600 dark:border-slate-700"></div>
          <p className="text-sm text-gray-600 dark:text-gray-400">Loading products...</p>
        </div>
      </div>
    );
  }

  if (!products || products.length === 0) {
    return (
      <div className="flex items-center justify-center rounded-lg border border-gray-200 bg-gray-50 py-12 dark:border-slate-700 dark:bg-slate-800">
        <p className="text-gray-600 dark:text-gray-400">No products found</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Table Container */}
      <div className="overflow-x-auto rounded-lg border border-gray-200 dark:border-slate-700">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200 bg-gray-50 dark:border-slate-700 dark:bg-slate-800">
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white">
                <button
                  onClick={() => onSort?.("name")}
                  className="flex items-center gap-2 hover:text-primary-600"
                >
                  Product Name <SortIcon field="name" />
                </button>
              </th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white">
                Category
              </th>
              <th className="px-4 py-3 text-right text-sm font-semibold text-gray-900 dark:text-white">
                <button
                  onClick={() => onSort?.("price")}
                  className="flex items-center justify-end gap-2 hover:text-primary-600"
                >
                  Price <SortIcon field="price" />
                </button>
              </th>
              <th className="px-4 py-3 text-center text-sm font-semibold text-gray-900 dark:text-white">
                <button
                  onClick={() => onSort?.("stock")}
                  className="flex items-center justify-center gap-2 hover:text-primary-600"
                >
                  Stock <SortIcon field="stock" />
                </button>
              </th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white">
                <button
                  onClick={() => onSort?.("createdAt")}
                  className="flex items-center gap-2 hover:text-primary-600"
                >
                  Created <SortIcon field="createdAt" />
                </button>
              </th>
              <th className="px-4 py-3 text-center text-sm font-semibold text-gray-900 dark:text-white">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {sortedProducts.map(product => (
              <tr
                key={product.id}
                onMouseEnter={() => setHoveredRow(product.id)}
                onMouseLeave={() => setHoveredRow(null)}
                className="border-b border-gray-200 transition-colors hover:bg-gray-50 dark:border-slate-700 dark:hover:bg-slate-700"
              >
                {/* Product Name */}
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    {product.imageUrl && (
                      <img
                        src={product.imageUrl}
                        alt={product.name}
                        className="h-10 w-10 rounded object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src =
                            "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='40' height='40'%3E%3Crect fill='%23f3f4f6' width='40' height='40'/%3E%3C/svg%3E";
                        }}
                      />
                    )}
                    <span className="font-medium text-gray-900 dark:text-white">
                      {product.name}
                    </span>
                  </div>
                </td>

                {/* Category */}
                <td className="px-4 py-3">
                  <span className="inline-flex rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                    {product.category}
                  </span>
                </td>

                {/* Price */}
                <td className="px-4 py-3 text-right font-semibold text-gray-900 dark:text-white">
                  {formatPrice(product.price)}
                </td>

                {/* Stock */}
                <td className="px-4 py-3 text-center">
                  <div className="flex flex-col items-center">
                    <span className="text-sm font-medium text-gray-900 dark:text-white">
                      {product.stock}
                    </span>
                    <span
                      className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${getStockColor(product.stock)}`}
                    >
                      {getStockStatus(product.stock)}
                    </span>
                  </div>
                </td>

                {/* Created Date */}
                <td className="px-4 py-3 text-gray-600 dark:text-gray-400">
                  {formatDate(product.createdAt)}
                </td>

                {/* Actions */}
                <td className="px-4 py-3">
                  <div className="flex items-center justify-center gap-2">
                    <button
                      onClick={() => onEdit(product)}
                      className="rounded-lg p-2 transition-all hover:bg-blue-100 dark:hover:bg-blue-900"
                      title="Edit product"
                      aria-label="Edit product"
                    >
                      <Edit2
                        size={18}
                        className="text-blue-600 dark:text-blue-400"
                      />
                    </button>
                    <button
                      onClick={() => onDelete(product)}
                      className="rounded-lg p-2 transition-all hover:bg-red-100 dark:hover:bg-red-900"
                      title="Delete product"
                      aria-label="Delete product"
                    >
                      <Trash2
                        size={18}
                        className="text-red-600 dark:text-red-400"
                      />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Page <span className="font-semibold">{currentPage}</span> of{" "}
            <span className="font-semibold">{totalPages}</span>
          </p>

          <div className="flex gap-2">
            <button
              onClick={() => onPageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="flex items-center gap-1 rounded-lg border border-gray-300 px-3 py-2 text-sm font-medium text-gray-700 transition-all hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed dark:border-slate-600 dark:text-gray-300 dark:hover:bg-slate-700"
            >
              <ChevronLeft size={16} />
              Previous
            </button>

            <div className="flex gap-1">
              {Array.from({ length: totalPages }, (_, i) => i + 1)
                .slice(
                  Math.max(0, currentPage - 2),
                  Math.min(totalPages, currentPage + 1)
                )
                .map(page => (
                  <button
                    key={page}
                    onClick={() => onPageChange(page)}
                    className={`min-w-10 rounded-lg px-3 py-2 text-sm font-medium transition-all ${
                      currentPage === page
                        ? "bg-primary-600 text-dark-7 cursor-default border border-gray-300 dark:bg-primary-500 dark:text-white"
                        : "border border-gray-300 text-gray-700 hover:bg-gray-50 dark:border-slate-600 dark:text-gray-300 dark:hover:bg-slate-700"
                    }`}
                  >
                    {page}
                  </button>
                ))}
            </div>

            <button
              onClick={() => onPageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="flex items-center gap-1 rounded-lg border border-gray-300 px-3 py-2 text-sm font-medium text-gray-700 transition-all hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed dark:border-slate-600 dark:text-gray-300 dark:hover:bg-slate-700"
            >
              Next
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
