import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import type { Metadata } from "next";
import OrdersManagement from "@/components/Admin/OrderManagement";

export const metadata: Metadata = {
    title: "Order Management",
};

export default function OrdersPage() {
    return (
        <div className="mx-auto w-full max-w-[1080px]">
            <Breadcrumb pageName="Order Management" />
            <OrdersManagement />
        </div>
    );
};
