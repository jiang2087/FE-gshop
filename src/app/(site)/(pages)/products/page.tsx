import ProductDetail from "@/components/Products/ProductDetails";
import { cookies } from "next/headers";
import { Metadata } from "next";
export const metadata: Metadata = {
  title: "gshop - Products  ",
  description: "This is the Products page for NextCommerce Template",
};

const ProductsPage = async () => {
  const cookieStore = await cookies(); 
  const token = cookieStore.get("cartKey")?.value; 

  return (
    <main>
      <ProductDetail cartKey={token} />
    </main>
  );
};

export default ProductsPage;
