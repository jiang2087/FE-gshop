import Home from "@/components/Home";
import { Metadata } from "next";
import { cookies } from "next/headers";
export const metadata: Metadata = {
  title: "gshop-home",
  description: "This is Home for NextCommerce Template",
  // other metadata
};

export default async function HomePage() {
    const cookieStore = await cookies(); 
  const token = cookieStore.get("cartKey")?.value; 
  return (
    <>
      <Home cartKey = {token} />
    </>
  );
}

