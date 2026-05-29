"use client";

import { useState, useRef, DragEvent, ChangeEvent } from "react";
import {
    Upload,
    FileText,
    X,
    Info,
    Database,
    Loader2,
    FileCode,
    FileSpreadsheet,
    FileQuestion
} from "lucide-react";
import { uploadDocument } from "@/api/adminApi";
import { toast } from "react-hot-toast";

// Helper to format file size
const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
};

// Helper to get file icon and color styling classes
const getFileInfo = (fileName: string) => {
    const extension = fileName.split(".").pop()?.toLowerCase();
    switch (extension) {
        case "pdf":
            return {
                icon: <FileText className="h-10 w-10 text-rose-500" />,
                bg: "bg-rose-50 dark:bg-rose-950/20",
                text: "text-rose-700 dark:text-rose-300",
                border: "border-rose-200 dark:border-rose-800/30"
            };
        // case "docx":
        // case "doc":
        //     return {
        //         icon: <FileText className="h-10 w-10 text-blue-500" />,
        //         bg: "bg-blue-50 dark:bg-blue-950/20",
        //         text: "text-blue-700 dark:text-blue-300",
        //         border: "border-blue-200 dark:border-blue-800/30"
        //     };
        case "txt":
        case "md":
            return {
                icon: <FileText className="h-10 w-10 text-teal-500" />,
                bg: "bg-teal-50 dark:bg-teal-950/20",
                text: "text-teal-700 dark:text-teal-300",
                border: "border-teal-200 dark:border-teal-800/30"
            };
        // case "json":
        //     return {
        //         icon: <FileCode className="h-10 w-10 text-amber-500" />,
        //         bg: "bg-amber-50 dark:bg-amber-950/20",
        //         text: "text-amber-700 dark:text-amber-300",
        //         border: "border-amber-200 dark:border-amber-800/30"
        //     };
        // case "csv":
        // case "xlsx":
        // case "xls":
        //     return {
        //         icon: <FileSpreadsheet className="h-10 w-10 text-emerald-500" />,
        //         bg: "bg-emerald-50 dark:bg-emerald-950/20",
        //         text: "text-emerald-700 dark:text-emerald-300",
        //         border: "border-emerald-200 dark:border-emerald-800/30"
        //     };
        default:
            return {
                icon: <FileQuestion className="h-10 w-10 text-slate-500" />,
                bg: "bg-slate-50 dark:bg-slate-900/20",
                text: "text-slate-700 dark:text-slate-300",
                border: "border-slate-200 dark:border-slate-800/30"
            };
    }
};

const ALLOWED_EXTENSIONS = ["pdf", "txt", "md", "json", "docx", "doc", "csv", "xlsx"];
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

export default function DataIngestion() {
    const [file, setFile] = useState<File | null>(null);
    const [isDragActive, setIsDragActive] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const validateFile = (selectedFile: File): string | null => {
        const extension = selectedFile.name.split(".").pop()?.toLowerCase();
        if (!extension || !ALLOWED_EXTENSIONS.includes(extension)) {
            return `Unsupported file format. Allowed formats: ${ALLOWED_EXTENSIONS.join(", ").toUpperCase()}`;
        }
        if (selectedFile.size > MAX_FILE_SIZE) {
            return `File size exceeds the 10MB limit. Your file is ${formatFileSize(selectedFile.size)}`;
        }
        return null;
    };

    const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        if (!isUploading) {
            setIsDragActive(true);
        }
    };

    const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragActive(false);
    };

    const handleDrop = (e: DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragActive(false);

        if (isUploading) return;

        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            const selectedFile = e.dataTransfer.files[0];
            const error = validateFile(selectedFile);
            if (error) {
                toast.error(error);
                return;
            }
            setFile(selectedFile);
        }
    };

    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const selectedFile = e.target.files[0];
            const error = validateFile(selectedFile);
            if (error) {
                toast.error(error);
                return;
            }
            setFile(selectedFile);
        }
    };

    const handleUpload = async () => {
        if (!file) return;

        setIsUploading(true);
        const uploadPromise = uploadDocument(file);

        toast.promise(
            uploadPromise,
            {
                loading: "Processing and ingesting document into knowledge base...",
                success: "Document ingested successfully! AI model has been updated.",
                error: (error: any) => {
                    console.error("Upload error:", error);
                    const errMsg = error?.response?.data?.message || error?.message || "Failed to ingest document";
                    return `Ingestion failed: ${errMsg}`;
                }
            }
        );

        try {
            await uploadPromise;
            setFile(null);
            if (fileInputRef.current) {
                fileInputRef.current.value = "";
            }
        } catch (error: any) {
            console.error("Error during upload:", error);
        } finally {
            setIsUploading(false);
        }
    };

    return (
        <div className="space-y-6">
            {/* Header section with glassmorphism gradient bg */}
            <div className="relative overflow-hidden rounded-2xl border border-gray-100 bg-gradient-to-r from-indigo-50/40 via-white to-violet-50/40 p-6 dark:border-dark-4 dark:from-dark-3 dark:to-dark-2">
                <div className="absolute top-0 right-0 -mt-4 -mr-4 h-32 w-32 rounded-full bg-indigo-500/10 blur-3xl"></div>
                <div className="relative flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div className="flex items-start gap-4">
                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-600 dark:bg-indigo-500/20 dark:text-indigo-400">
                            <Database className="h-6 w-6" />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-dark-2 dark:text-meta-5">
                                Document Ingestion Panel
                            </h2>
                            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                                Import knowledge documents to feed the Retrieval-Augmented Generation (RAG) vector engine.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Drag and Drop Upload Area */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-default dark:border-dark-4 dark:bg-dark-3">
                        <h3 className="text-lg font-semibold text-dark-2 dark:text-meta-5 mb-4">
                            Upload Knowledge Document
                        </h3>

                        <div
                            onDragOver={handleDragOver}
                            onDragLeave={handleDragLeave}
                            onDrop={handleDrop}
                            onClick={() => !file && !isUploading && fileInputRef.current?.click()}
                            className={`relative flex flex-col items-center justify-center rounded-xl border-2 border-dashed p-10 text-center transition-all duration-300 ${file
                                ? "border-emerald-300 bg-emerald-50/10 dark:border-emerald-800/40"
                                : isDragActive
                                    ? "border-indigo-500 bg-indigo-50/30 dark:border-indigo-400 dark:bg-indigo-950/20 scale-[1.01] shadow-lg shadow-indigo-500/5"
                                    : "border-gray-300 bg-gray-50/50 hover:bg-gray-100/50 dark:border-dark-4 dark:bg-dark-2/40 dark:hover:bg-dark-2/80 cursor-pointer"
                                }`}
                        >
                            <input
                                type="file"
                                ref={fileInputRef}
                                onChange={handleFileChange}
                                accept={ALLOWED_EXTENSIONS.map(ext => `.${ext}`).join(",")}
                                className="hidden"
                                disabled={isUploading}
                            />

                            {file ? (
                                // File Selected Layout
                                <div className="w-full flex flex-col items-center">
                                    <div className={`p-4 rounded-2xl mb-4 border ${getFileInfo(file.name).bg} ${getFileInfo(file.name).border}`}>
                                        {getFileInfo(file.name).icon}
                                    </div>
                                    <span className="text-base font-semibold text-dark-2 dark:text-meta-5 max-w-md truncate px-4 text-center">
                                        {file.name}
                                    </span>
                                    <span className="mt-1 text-xs text-gray-500 dark:text-gray-400 font-mono">
                                        Size: {formatFileSize(file.size)} | Format: {file.name.split(".").pop()?.toUpperCase()}
                                    </span>

                                    {/* Action Buttons inside the drop area */}
                                    <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
                                        <button
                                            type="button"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                if (fileInputRef.current) fileInputRef.current.value = "";
                                                setFile(null);
                                            }}
                                            disabled={isUploading}
                                            className="inline-flex items-center gap-2 rounded-xl hover:bg-gray-3 bg-indigo-600 px-6 py-2.5 text-sm font-bold text-dark shadow-lg shadow-indigo-600/10 hover:bg-indigo-700 hover:shadow-indigo-700/20 transition-all active:scale-95 disabled:opacity-50"

                                        >
                                            <X className="h-4 w-4 text-red-light" /> Remove File
                                        </button>
                                        <button
                                            type="button"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleUpload();
                                            }}
                                            disabled={isUploading}
                                            className="inline-flex items-center gap-2 rounded-xl hover:bg-gray-3 bg-indigo-600 px-6 py-2.5 text-sm font-bold text-dark shadow-lg shadow-indigo-600/10 hover:bg-indigo-700 hover:shadow-indigo-700/20 transition-all active:scale-95 disabled:opacity-50"
                                        >
                                            {isUploading ? (
                                                <>
                                                    <Loader2 className="h-4 w-4 animate-spin" /> Ingesting Data...
                                                </>
                                            ) : (
                                                <>
                                                    <Database className="h-4 w-4" /> Ingest to RAG
                                                </>
                                            )}
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                // Empty state layout
                                <div className="flex flex-col items-center cursor-pointer">
                                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 mb-4">
                                        <Upload className="h-7 w-7 animate-bounce-slow" />
                                    </div>
                                    <p className="text-base font-semibold text-dark-2 dark:text-meta-5">
                                        Drag & drop files here, or <span className="text-indigo-600 dark:text-indigo-400 underline decoration-indigo-500/30 underline-offset-2">browse</span>
                                    </p>
                                    <p className="mt-2 text-xs text-gray-500 dark:text-gray-400 max-w-sm">
                                        Supports PDF, DOCX, DOC, TXT, MD, CSV, XLSX, and JSON documents up to 10MB.
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Information / Guideline Cards */}
                <div className="space-y-6">
                    {/* supported formats card */}
                    <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-default dark:border-dark-4 dark:bg-dark-3">
                        <h4 className="flex items-center gap-2 text-base font-bold text-dark-2 dark:text-meta-5 mb-4">
                            <Info className="h-5 w-5 text-indigo-500" /> Guidelines & Formats
                        </h4>

                        <div className="space-y-3">
                            <div className="flex items-start gap-3 p-3 bg-slate-50 dark:bg-dark-2 rounded-xl border border-gray-50 dark:border-dark-4">
                                <div className="mt-0.5 font-bold text-xs text-indigo-600 dark:text-indigo-400 shrink-0 bg-white dark:bg-dark-3 h-5 w-5 rounded-full flex items-center justify-center border border-gray-100 dark:border-dark-4">
                                    1
                                </div>
                                <div className="text-xs">
                                    <p className="font-bold text-dark-2 dark:text-meta-5">Ensure Text Content Quality</p>
                                    <p className="mt-0.5 text-gray-500 dark:text-gray-400 leading-relaxed">
                                        Upload documents with structured headings, clean formatting, and clear paragraphs for higher chunk accuracy.
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-start gap-3 p-3 bg-slate-50 dark:bg-dark-2 rounded-xl border border-gray-50 dark:border-dark-4">
                                <div className="mt-0.5 font-bold text-xs text-indigo-600 dark:text-indigo-400 shrink-0 bg-white dark:bg-dark-3 h-5 w-5 rounded-full flex items-center justify-center border border-gray-100 dark:border-dark-4">
                                    2
                                </div>
                                <div className="text-xs">
                                    <p className="font-bold text-dark-2 dark:text-meta-5">Optimized Formats</p>
                                    <p className="mt-0.5 text-gray-500 dark:text-gray-400 leading-relaxed">
                                        PDF, DOCX, TXT, and Markdown files are standard and highly recommended. JSON should specify clear structural keys.
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-start gap-3 p-3 bg-slate-50 dark:bg-dark-2 rounded-xl border border-gray-50 dark:border-dark-4">
                                <div className="mt-0.5 font-bold text-xs text-indigo-600 dark:text-indigo-400 shrink-0 bg-white dark:bg-dark-3 h-5 w-5 rounded-full flex items-center justify-center border border-gray-100 dark:border-dark-4">
                                    3
                                </div>
                                <div className="text-xs">
                                    <p className="font-bold text-dark-2 dark:text-meta-5">Vector Embedding Update</p>
                                    <p className="mt-0.5 text-gray-500 dark:text-gray-400 leading-relaxed">
                                        Ingested files are dynamically parsed, converted into dense vectors, and stored. The AI assistant can utilize them instantly.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}