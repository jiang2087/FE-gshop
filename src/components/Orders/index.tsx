import React from "react";
import SingleOrder from "./SingleOrder";
import { Order } from "../../api/orderApi";

interface OrdersProps {
  orders: Order[];
  loading: boolean;
  refreshOrders: () => void;
}

const Orders = ({ orders, loading, refreshOrders }: OrdersProps) => {
  if (loading) {
    return <div className="p-10 text-center">Loading orders...</div>;
  }

  const mappedOrders = orders;

  return (
    <>
      <div className="w-full overflow-x-auto">
        <div className="min-w-[770px]">
          {/* <!-- order item --> */}
          {mappedOrders.length > 0 && (
            <div className="items-center justify-between py-4.5 px-7.5 hidden md:flex ">
              <div className="min-w-[120px]">
                <p className="text-custom-sm text-dark font-medium">Order Code</p>
              </div>
              <div className="min-w-[150px]">
                <p className="text-custom-sm text-dark font-medium">Date</p>
              </div>

              <div className="min-w-[120px]">
                <p className="text-custom-sm text-dark font-medium">Status</p>
              </div>

              <div className="min-w-[100px]">
                <p className="text-custom-sm text-dark font-medium">Shipping</p>
              </div>

              <div className="min-w-[100px]">
                <p className="text-custom-sm text-dark font-medium">Discount</p>
              </div>

              <div className="min-w-[100px]">
                <p className="text-custom-sm text-dark font-medium">Total</p>
              </div>

              <div className="min-w-[100px]">
                <p className="text-custom-sm text-dark font-medium">Action</p>
              </div>
            </div>
          )}
          {mappedOrders.length > 0 ? (
            mappedOrders.map((orderItem, key) => (
              <SingleOrder key={key} orderItem={orderItem} smallView={false} refreshOrders={refreshOrders} />
            ))
          ) : (
            <p className="py-9.5 px-4 sm:px-7.5 xl:px-10">
              You don&apos;t have any orders!
            </p>
          )}
        </div>

        {mappedOrders.length > 0 &&
          mappedOrders.map((orderItem, key) => (
            <SingleOrder key={key} orderItem={orderItem} smallView={true} refreshOrders={refreshOrders} />
          ))}
      </div>
    </>
  );
};

export default Orders;
