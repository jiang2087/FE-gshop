import MyAccount from "@/components/MyAccount";

import { Metadata } from "next";
export const metadata: Metadata = {
  title: "My Account | gshop",
  description: "This is My Account page for NextCommerce Template",
  // other metadata
};

const MyAccountPage = () => {
  return (
    <main>
      <MyAccount />
    </main>
  );
};

export default MyAccountPage;
