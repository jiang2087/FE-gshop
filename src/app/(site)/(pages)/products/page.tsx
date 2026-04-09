import ProductDetail from "@/components/Products/ProductDetails";

import { Metadata } from "next";
export const metadata: Metadata = {
  title: "gshop - Products  ",
  description: "This is the Products page for NextCommerce Template",
};

const ProductsPage = () => {
  return (
    <main>
      <ProductDetail/>
    </main>
  );
};

export default ProductsPage;
