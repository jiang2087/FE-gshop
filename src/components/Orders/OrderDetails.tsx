import React, { useEffect, useState } from "react";
import { getOrderItems, OrderItemResponse, OrderStatus } from "../../api/orderApi";

const OrderDetails = ({ orderItem }: any) => {
  const [items, setItems] = useState<OrderItemResponse[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchItems = async () => {
      try {
        setLoading(true);
        const data = await getOrderItems(orderItem.id);
        setItems(data);
      } catch (error) {
        console.error("Failed to fetch order items:", error);
      } finally {
        setLoading(false);
      }
    };

    if (orderItem?.id) {
      fetchItems();
    }
  }, [orderItem?.id]);

  const formatDate = (date: string) => {
    return new Intl.DateTimeFormat("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    }).format(new Date(date));
  };

  return (
    <div className="w-full h-full overflow-y-auto p-4 pt-12 sm:p-6 sm:pt-14 flex flex-col gap-6">
      {/* Order Info Summary */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-gray-3 pb-4">
        <div>
          <p className="text-custom-sm text-dark font-bold">Order Code</p>
          <p className="text-custom-sm text-red font-medium">{orderItem.orderCode}</p>
        </div>
        <div>
          <p className="text-custom-sm text-dark font-bold">Date</p>
          <p className="text-custom-sm text-dark">{formatDate(orderItem.createdAt)}</p>
        </div>
        <div>
          <p className="text-custom-sm text-dark font-bold">Status</p>
          <p
            className={`inline-block text-custom-sm py-0.5 px-2.5 rounded-[30px] capitalize font-medium ${orderItem.status === OrderStatus.COMPLETED
              ? "text-green bg-green-light-6"
              : orderItem.status === OrderStatus.CANCELLED
                ? "text-red bg-red-light-6"
                : orderItem.status === OrderStatus.PROCESSING || orderItem.status === OrderStatus.PENDING
                  ? "text-yellow-dark-2 bg-yellow-light-2"
                  : orderItem.status === OrderStatus.SHIPPED
                    ? "text-blue bg-blue-light-5"
                    : "text-gray-6 bg-gray-2"
              }`}
          >
            {orderItem.status}
          </p>
        </div>
        <div>
          <p className="text-custom-sm text-dark font-bold">Grand Total</p>
          <p className="text-custom-sm text-dark font-bold">${orderItem.totalPrice.toLocaleString()}</p>
        </div>
      </div>

      {/* Items List */}
      <div>
        <p className="text-base font-bold text-dark mb-3">Order Items</p>
        {loading ? (
          <p className="text-center py-4">Loading items...</p>
        ) : items.length > 0 ? (
          <div className="flex flex-col gap-4">
            {items.map((item) => (
              <div key={item.id} className="flex items-center gap-4 border-b border-gray-2 pb-4 last:border-0">
                <div className="h-16 w-16 flex-shrink-0 overflow-hidden rounded-md border border-gray-2">
                  <img src={item.image} alt={item.productName} className="h-full w-full object-cover object-center" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-custom-sm font-bold text-dark truncate">{item.productName}</p>
                  <p className="text-xs text-gray-5">SKU: {item.sku}</p>
                  <p className="text-xs text-gray-5">Qty: {item.quantity}</p>
                </div>
                <div className="text-right">
                  <p className="text-custom-sm font-bold text-dark">${item.subtotal.toLocaleString()}</p>
                  <p className="text-xs text-gray-5">${item.price.toLocaleString()} each</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center py-4 text-gray-5">No items found for this order.</p>
        )}
      </div>

      {/* Shipping & Payment Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 bg-gray-1 p-4 rounded-lg">
        <div>
          <p className="font-bold text-dark mb-1">Shipping Details</p>
          <p className="text-custom-sm text-dark">Shipping Fee: ${orderItem.shippingFee.toLocaleString()}</p>
          <p className="text-custom-sm text-dark">Discount: -${orderItem.discountAmount.toLocaleString()}</p>
        </div>
        <div>
          <p className="font-bold text-dark mb-1">Shipping Address</p>
          <p className="text-custom-sm text-dark">942 Aspen Road Encino, CA 91316</p>
        </div>
      </div>
    </div>
  );
};

export default OrderDetails;
