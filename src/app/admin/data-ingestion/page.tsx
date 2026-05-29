import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import type { Metadata } from "next";
import DataIngestion from "@/components/Admin/dataIngestion";

export const metadata: Metadata = {
    title: "Data Ingestion",
};

export default function OrdersPage() {
    return (
        <div className="mx-auto w-full max-w-[1080px]">
            <Breadcrumb pageName="Data Ingestion" />
            <DataIngestion />
        </div>
    );
};
