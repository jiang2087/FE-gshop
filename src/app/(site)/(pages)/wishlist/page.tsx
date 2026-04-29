import React from "react";
import { Wishlist } from "@/components/Wishlist";
import { Metadata } from "next";
import { cookies } from "next/headers";

export const metadata: Metadata = {
  title: "Wishlist Page - gshop",
  description: "This is Wishlist Page for NextCommerce Template",
  // other metadata
};

const WishlistPage = async () => {
  const cookieStore = await cookies(); 
    const token = cookieStore.get("cartKey")?.value; 
  return (
    <main>
      <Wishlist cartKey={token} />
    </main>
  );
};

export default WishlistPage;
