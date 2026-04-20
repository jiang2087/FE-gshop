import Cart from "@/components/Cart";
import { cookies } from "next/headers";
import { Metadata } from "next";
export const metadata: Metadata = {
  title: "gshop-Cart Page",
  description: "This is Cart Page of gshop",
  // other metadata
};

type Props = {
  cartKey?: string;
};


const CartPage = async () => {
  const cookieStore = await cookies();
  const cartKey = cookieStore.get("cartKey")?.value;
  return (
    <>
      <Cart cartKey={cartKey} />
    </>
  );
};

export default CartPage;
