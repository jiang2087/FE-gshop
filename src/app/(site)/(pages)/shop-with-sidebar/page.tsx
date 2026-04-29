import React from "react";
import ShopWithSidebar from "@/components/ShopWithSidebar";
import {cookies} from "next/headers";

import { Metadata } from "next";
export const metadata: Metadata = {
  title: "Shop Page - gshop",
  description: "This is Shop Page for NextCommerce Template",
  // other metadata
};

const ShopWithSidebarPage = async () => {
  const cookieStore = await cookies();
  const cartKey = cookieStore.get("cartKey")?.value || "";
  return (
    <main>
      <ShopWithSidebar cartKey={cartKey} />
    </main>
  );
};

export default ShopWithSidebarPage;
