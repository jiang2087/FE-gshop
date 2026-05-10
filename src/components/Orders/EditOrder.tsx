import React, { useState } from "react";
import toast from "react-hot-toast";
import { OrderStatus, updateMyOrderStatus } from "../../api/orderApi";

const EditOrder = ({ order, toggleModal, refreshOrders }: any) => {
  const [currentStatus, setCurrentStatus] = useState("");
  const [loading, setLoading] = useState(false);
  const orderStatus = order?.status as OrderStatus;

  const allowedTransitions: Record<OrderStatus, OrderStatus[]> = {
    [OrderStatus.PENDING]: [OrderStatus.CANCELLED],
    [OrderStatus.PROCESSING]: [OrderStatus.SHIPPED, OrderStatus.CANCELLED],
    [OrderStatus.SHIPPED]: [OrderStatus.COMPLETED],
    [OrderStatus.COMPLETED]: [],
    [OrderStatus.CANCELLED]: [],
  };

  const nextStatuses = allowedTransitions[orderStatus] || [];

  const handleChanege = (e: any) => {
    setCurrentStatus(e.target.value);
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    if (!currentStatus) {
      toast.error("Please select a status");
      return;
    }

    if (!nextStatuses.includes(currentStatus as OrderStatus)) {
      toast.error("Invalid status transition");
      return;
    }

    setLoading(true);
    try {
      await updateMyOrderStatus(order.id, currentStatus);
      toast.success("Order status updated successfully");
      refreshOrders();
      toggleModal(false);
    } catch (error) {
      toast.error("Failed to update order status");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full px-5 pt-16 pb-8 sm:px-10 sm:pt-14 sm:pb-10">
      <p className="pb-3 text-base font-medium text-dark">Order Status</p>
      <div className="w-full">
        <select
          className="w-full rounded-[10px] border outline-none border-gray-3 bg-gray-1 text-dark py-3.5 px-4 text-custom-sm"
          name="status"
          id="status"
          required
          disabled={nextStatuses.length === 0}
          onChange={handleChanege}
          value={currentStatus}
        >
          <option value="" disabled>
            {orderStatus === OrderStatus.PENDING
              ? "Pending orders can only be cancelled"
              : "Select next order status"}
          </option>
          {nextStatuses.map((status) => (
            <option key={status} value={status}>
              {status}
            </option>
          ))}
        </select>
        <p className="mt-2 text-xs text-red-light">
          Pending orders can only move to Cancelled. Processing orders can move to Shipped or Cancelled. Shipped orders can move to Completed.
        </p>

        <div className="mt-5 flex w-full flex-col gap-3 sm:flex-row">
          <button
            type="button"
            className="w-full rounded-[10px] hover:bg-gray-1 border border-stroke bg-white text-dark py-3.5 px-5 text-custom-sm sm:w-1/2 disabled:opacity-50"
            onClick={() => toggleModal(false)}
            disabled={loading}
          >
            Cancel
          </button>
          <button
            type="button"
            className="w-full rounded-[10px] hover:bg-blue-dark border border-blue bg-blue text-white py-3.5 px-5 text-custom-sm sm:w-1/2 disabled:opacity-50"
            onClick={handleSubmit}
            disabled={nextStatuses.length === 0 || loading || !currentStatus}
          >
            {loading ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditOrder;
