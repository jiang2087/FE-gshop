import React, { useState } from "react";
import OrderActions from "./OrderActions";
import OrderModal from "./OrderModal";
import { OrderStatus } from "../../api/orderApi";

const SingleOrder = ({ orderItem, smallView, refreshOrders }: any) => {
  const [showDetails, setShowDetails] = useState(false);
  const [showEdit, setShowEdit] = useState(false);

  const toggleDetails = () => {
    setShowDetails(!showDetails);
  };

  const toggleEdit = () => {
    setShowEdit(!showEdit);
  };

  const toggleModal = (status: boolean) => {
    setShowDetails(status);
    setShowEdit(status);
  };
  const formatDate = (date) => {
    return new Intl.DateTimeFormat("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    }).format(new Date(date));
  };

  return (
    <>
      {!smallView && (
        <div className="items-center justify-between border-t border-gray-3 py-5 px-7.5 hidden md:flex">
          <div className="min-w-[120px]">
            <p className="text-custom-sm text-red font-medium">
              {orderItem.orderCode}
            </p>
          </div>
          <div className="min-w-[150px]">
            <p className="text-custom-sm text-dark">{formatDate(orderItem.createdAt)}</p>
          </div>

          <div className="min-w-[120px]">
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

          <div className="min-w-[100px]">
            <p className="text-custom-sm text-dark">${orderItem.shippingFee.toLocaleString()}</p>
          </div>

          <div className="min-w-[100px]">
            <p className="text-custom-sm text-dark">-${orderItem.discountAmount.toLocaleString()}</p>
          </div>

          <div className="min-w-[100px]">
            <p className="text-custom-sm text-dark font-bold">${orderItem.totalPrice.toLocaleString()}</p>
          </div>

          <div className="min-w-[100px] flex justify-center">
            <OrderActions
              toggleDetails={toggleDetails}
              toggleEdit={toggleEdit}
            />
          </div>
        </div>
      )}

      {smallView && (
        <div className="block md:hidden">
          <div className="py-4.5 px-7.5 border-t border-gray-3">
            <div className="flex justify-between items-center mb-2">
              <p className="text-custom-sm text-dark font-bold">#{orderItem.id}</p>
              <OrderActions
                toggleDetails={toggleDetails}
                toggleEdit={toggleEdit}
              />
            </div>
            <div className="">
              <p className="text-custom-sm text-dark">
                <span className="font-bold pr-2"> Order Code:</span>
                <span className="text-red font-medium">{orderItem.orderCode}</span>
              </p>
            </div>
            <div className="">
              <p className="text-custom-sm text-dark">
                <span className="font-bold pr-2">Date:</span>{" "}
                {formatDate(orderItem.createdAt)}
              </p>
            </div>

            <div className="mt-1">
              <p className="text-custom-sm text-dark">
                <span className="font-bold pr-2">Status:</span>{" "}
                <span
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
                </span>
              </p>
            </div>

            <div className="mt-2 flex flex-col gap-1 border-t border-gray-2 pt-2">
              <p className="text-custom-sm text-dark flex justify-between">
                <span className="font-bold">Shipping:</span>
                <span>${orderItem.shippingFee.toLocaleString()}</span>
              </p>
              <p className="text-custom-sm text-dark flex justify-between">
                <span className="font-bold">Discount:</span>
                <span className="text-red">-${orderItem.discountAmount.toLocaleString()}</span>
              </p>
              <p className="text-custom-sm text-dark flex justify-between pt-1 border-t border-gray-2">
                <span className="font-bold">Total:</span>
                <span className="font-bold text-dark">${orderItem.totalPrice.toLocaleString()}</span>
              </p>
            </div>
          </div>
        </div>
      )}

      <OrderModal
        showDetails={showDetails}
        showEdit={showEdit}
        toggleModal={toggleModal}
        order={orderItem}
        refreshOrders={refreshOrders}
      />
    </>
  );
};

export default SingleOrder;
