import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import type { Metadata } from "next";
import AdminProductsManagement from "@/components/Admin/AdminProductsManagement";

export const metadata: Metadata = {
    title: "Products Page",
};

export default function ProductsPage() {
    return (
        <div className="mx-auto w-full max-w-[1080px]">
            <Breadcrumb pageName="Products" />
            <AdminProductsManagement />

        </div>
    );
};
