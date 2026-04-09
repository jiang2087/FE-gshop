"use client";

import type { FC } from "react";
import { X } from "lucide-react";

interface DeleteConfirmDialogProps {
  isOpen: boolean;
  productName?: string;
  isLoading?: boolean;
  onConfirm: () => Promise<void> | void;
  onCancel: () => void;
}

export const DeleteConfirmDialog: FC<DeleteConfirmDialogProps> = ({
  isOpen,
  productName = "this product",
  isLoading = false,
  onConfirm,
  onCancel,
}) => {
  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-40 bg-black/50 transition-opacity duration-300"
        onClick={onCancel}
      />

      {/* Modal */}
      <div className="fixed left-1/2 top-1/2 z-50 w-full max-w-md -translate-x-1/2 -translate-y-1/2 transform rounded-lg bg-white p-6 shadow-lg dark:bg-slate-800">
        {/* Header */}
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white">
            Delete Product
          </h2>
          <button
            onClick={onCancel}
            disabled={isLoading}
            className="rounded-lg p-1 hover:bg-gray-100 disabled:opacity-50 dark:hover:bg-slate-700"
            aria-label="Close dialog"
          >
            <X size={20} className="text-gray-500 dark:text-gray-400" />
          </button>
        </div>

        {/* Content */}
        <div className="mb-6">
          <p className="text-gray-600 dark:text-gray-300">
            Are you sure you want to delete <span className="font-semibold">{productName}</span>?
          </p>
          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
            This action cannot be undone.
          </p>
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <button
            onClick={onCancel}
            disabled={isLoading}
            className="flex-1 rounded-lg border border-gray-300 bg-white px-4 py-2.5 font-medium text-gray-700 transition-colors hover:bg-gray-50 disabled:opacity-50 dark:border-slate-600 dark:bg-slate-700 dark:text-gray-300 dark:hover:bg-slate-600"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={isLoading}
            className="flex-1 rounded-lg bg-red-600 px-4 py-2.5 font-medium text-white transition-colors hover:bg-red-700 disabled:opacity-50"
          >
            {isLoading ? "Deleting..." : "Delete"}
          </button>
        </div>
      </div>
    </>
  );
};
