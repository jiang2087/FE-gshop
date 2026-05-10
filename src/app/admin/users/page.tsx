import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import type { Metadata } from "next";
import UserManagement from "@/components/Admin/UserManagement";

export const metadata: Metadata = {
    title: "User Management",
};

export default function UsersPage() {
    return (
        <div className="mx-auto w-full max-w-[1080px]">
            <Breadcrumb pageName="User Management" />
            <UserManagement />
        </div>
    );
}
