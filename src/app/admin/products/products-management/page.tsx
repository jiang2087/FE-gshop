"use client";

import { useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Plus, Search, AlertCircle } from "lucide-react";
import { ProductTable } from "@/components/Admin/ProductTable";
import { ProductForm } from "@/components/Admin/ProductForm";
import { DeleteConfirmDialog } from "@/components/Admin/DeleteConfirmDialog";
import type { Product, ProductFormData } from "@/types/productManagement";
import {
  getProducts,
  createProduct,
  updateProduct,
  deleteProduct,
} from "@/lib/actions/productActions";

const PAGE_SIZE = 10;

type SortField = "name" | "price" | "stock" | "createdAt";

export default function ProductsManagementPage() {
  // State
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [sortBy, setSortBy] = useState<SortField | null>(null);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

  // Modal state
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | undefined>();
  const [isFormLoading, setIsFormLoading] = useState(false);

  // Delete dialog state
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);
  const [isDeleteLoading, setIsDeleteLoading] = useState(false);

  // Fetch products
  const fetchProducts = useCallback(async (page: number, search: string) => {
    try {
      setIsLoading(true);
      const result = await getProducts(page, PAGE_SIZE, search);

      if (result.success && result.products) {
        setProducts(result.products);
        setTotalPages(result.pagination?.totalPages || 1);
        setCurrentPage(result.pagination?.currentPage || 1);
      } else {
        toast.error(result.message || "Failed to load products");
      }
    } catch (error) {
      toast.error("Error loading products");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Initial load
  useEffect(() => {
    fetchProducts(1, "");
  }, [fetchProducts]);

  // Handle search
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    setCurrentPage(1);
    fetchProducts(1, query);
  };

  // Handle sort
  const handleSort = (field: SortField) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(field);
      setSortOrder("asc");
    }
  };

  // Handle add product
  const handleAddProduct = () => {
    setSelectedProduct(undefined);
    setIsFormOpen(true);
  };

  // Handle edit product
  const handleEditProduct = (product: Product) => {
    setSelectedProduct(product);
    setIsFormOpen(true);
  };

  // Handle form submit
  const handleFormSubmit = async (data: ProductFormData) => {
    try {
      setIsFormLoading(true);

      let result;
      if (selectedProduct) {
        result = await updateProduct(selectedProduct.id, data);
      } else {
        result = await createProduct(data);
      }

      if (result.success) {
        toast.success(result.message || (selectedProduct ? "Product updated!" : "Product created!"));
        setIsFormOpen(false);
        setSelectedProduct(undefined);
        await fetchProducts(currentPage, searchQuery);
      } else {
        toast.error(result.message || "Operation failed");
      }
    } catch (error) {
      toast.error("An error occurred");
      console.error(error);
    } finally {
      setIsFormLoading(false);
    }
  };

  // Handle delete product
  const handleDeleteProduct = (product: Product) => {
    setProductToDelete(product);
    setShowDeleteConfirm(true);
  };

  // Confirm delete
  const handleConfirmDelete = async () => {
    if (!productToDelete) return;

    try {
      setIsDeleteLoading(true);
      const result = await deleteProduct(productToDelete.id);

      if (result.success) {
        toast.success("Product deleted successfully");
        setShowDeleteConfirm(false);
        setProductToDelete(null);

        // Adjust page if necessary
        const newPage = products.length === 1 && currentPage > 1 ? currentPage - 1 : currentPage;
        await fetchProducts(newPage, searchQuery);
        setCurrentPage(newPage);
      } else {
        toast.error(result.message || "Failed to delete product");
      }
    } catch (error) {
      toast.error("Error deleting product");
      console.error(error);
    } finally {
      setIsDeleteLoading(false);
    }
  };

  // Handle pagination
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    fetchProducts(page, searchQuery);
  };

  return (
    <div className="space-y-4 md:space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-dark-2 dark:text-white">
            Products Management
          </h1>
          <p className="mt-1 text-sm text-dark-2 dark:text-black-300">
            Manage your product inventory, add new items, and update product information
          </p>
        </div>
      </div>

      {/* Toolbar */}
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        {/* Search */}
        <div className="relative flex-1 md:max-w-xs">
          <Search
            size={18}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          />
          <input
            type="text"
            placeholder="Search products..."
            value={searchQuery}
            onChange={handleSearch}
            className="w-full rounded-lg border bg-white pl-10 pr-4 py-2.5 text-gray-900 placeholder-gray-500 transition-colors focus:border-primary-600 focus:outline-none focus:ring-1 focus:ring-primary-600 dark:border-slate-600 dark:bg-slate-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-primary-500 dark:focus:ring-primary-500"
          />
        </div>

        {/* Add Product Button */}
        <button
          onClick={handleAddProduct}
          className="flex items-center justify-center gap-2 rounded-lg bg-primary-600 px-4 py-2.5 font-medium text-dark-2 transition-colors hover:bg-primary-700 active:bg-primary-800 dark:bg-primary-600 dark:hover:bg-primary-700"
        >
          <Plus size={18} />
          Add Product
        </button>
      </div>

      {/* Info Alert */}
      {products.length === 0 && !isLoading && (
        <div className="flex items-start gap-3 rounded-lg border border-blue-200 bg-blue-50 p-4 dark:border-blue-900 dark:bg-blue-900/20">
          <AlertCircle size={18} className="mt-0.5 flex-shrink-0 text-blue-600 dark:text-blue-400" />
          <div>
            <h3 className="font-medium text-blue-900 dark:text-blue-300">No products yet</h3>
            <p className="text-sm text-blue-700 dark:text-blue-200">
              Get started by creating your first product
            </p>
          </div>
        </div>
      )}

      {/* Products Table */}
      <div className="rounded-lg border text-dark border-gray-200 bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-slate-800 md:p-6">
        <ProductTable
          products={products}
          isLoading={isLoading}
          sortBy={sortBy || undefined}
          sortOrder={sortOrder}
          currentPage={currentPage}
          totalPages={totalPages}
          onEdit={handleEditProduct}
          onDelete={handleDeleteProduct}
          onPageChange={handlePageChange}
          onSort={handleSort}
        />
      </div>

      {/* Modals */}
      <ProductForm
        isOpen={isFormOpen}
        product={selectedProduct}
        isLoading={isFormLoading}
        onSubmit={handleFormSubmit}
        onClose={() => {
          setIsFormOpen(false);
          setSelectedProduct(undefined);
        }}
      />

      <DeleteConfirmDialog
        isOpen={showDeleteConfirm}
        productName={productToDelete?.name}
        isLoading={isDeleteLoading}
        onConfirm={handleConfirmDelete}
        onCancel={() => {
          setShowDeleteConfirm(false);
          setProductToDelete(null);
        }}
      />
    </div>
  );
}
