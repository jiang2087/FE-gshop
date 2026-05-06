"use client";
import React, { useState, useEffect } from "react";
import Breadcrumb from "../Common/Breadcrumb";
import Login from "./Login";
// import Shipping from "./Shipping";
import ShippingMethod from "./ShippingMethod";
import PaymentMethod from "./PaymentMethod";
import Coupon from "./Coupon";
import Billing from "./Billing";
import { selectCartTotal } from "@/redux/slices/cart-slice";
import { useAppSelector, useAppDispatch } from "@/redux/hooks";
import { getAddressesByUser } from "@/redux/slices/addressSlice";
import { getPreviewVoucher, applyVoucher } from "@/api/discountApi";
import { useSearchParams, useRouter } from "next/navigation";
import { toast, Toaster } from "react-hot-toast";
import { createOrder, CreateOrderPayload } from "@/api/orderApi";
import { fetchCart } from "@/redux/slices/cart-slice";


const Checkout = () => {
  const { user, isAuthenticated } = useAppSelector((state) => state.auth);
  const { addresses } = useAppSelector((state) => state.address);
  const cartItems = useAppSelector((state) => state.cartReducer.items);
  const totalPrice = useAppSelector(selectCartTotal);
  const searchParams = useSearchParams();
  const dispatch = useAppDispatch();
  const code = searchParams.get("code");
  const router = useRouter();

  const [billing, setBilling] = useState({
    recipientName: "",
    phone: "",
    address: "",
  });

  // const [shipping, setShipping] = useState({
  //   recipientName: "",
  //   phone: "",
  //   address: "",
  // });

  const [coupon, setCoupon] = useState("");
  const [notes, setNotes] = useState("");
  const defaultAddress = Array.isArray(addresses)
    ? addresses.find((a) => a && a.isDefault)
    : null;
  const defaultAddressId = defaultAddress?.id;
  const [selectedAddressId, setSelectedAddressId] = useState(defaultAddressId);

  const [discountAmount, setDiscountAmount] = useState(0);

  const handleApplyCoupon = async (code: string) => {
    const toastId = toast.loading("loading...");
    if (!user?.id) {
      toast.error("Please sign to continue.", { id: toastId });
      return;
    }
    try {
      const previewDiscount = await getPreviewVoucher(
        code,
        user.id,
        totalPrice,
      );
      setCoupon(code);
      setDiscountAmount(previewDiscount ?? 0);
      toast.success("apply voucher successfully", { id: toastId });
    } catch (error: any) {
      setDiscountAmount(0);
      toast.error(error?.response?.data?.message, { id: toastId });
    }
  };

  const handleChangrAddress = (value: number) => {
    setSelectedAddressId(value);
  };

  const handleCheckout = async () => {
    const toastId = toast.loading("Processing your order...");
    if (!isAuthenticated || !user?.id) {
      toast.error("please sign in to checkout", { id: toastId });
      return;
    }

    if (!selectedAddressId) {
      toast.error("Please choose your address", { id: toastId });
      return;
    }

    if (!cartItems || cartItems.length === 0) {
      toast.error("Your cart is empty", { id: toastId });
      return;
    }

    const payload: CreateOrderPayload = {
      userId: user.id,
      addressId: selectedAddressId,
      items: cartItems.map((item) => ({
        variantId: item.productVariantId,
        quantity: item.quantity,
      })),
      paymentMethod: "COD",
      note: notes,
      voucherCode: coupon || undefined,
    };

    try {
      await createOrder(payload);
      await dispatch(fetchCart(user.id));
      toast.success("order placed successfully", { id: toastId });
      router.push("/mail-success?type=order")
    } catch (error: any) {
      toast.error(
        error.response?.data?.message || "sever got some error with your order",
        { id: toastId },
      );
    }
  };

  useEffect(() => {
    if (user?.id) {
      dispatch(getAddressesByUser(user.id));
    }
  }, []);

  return (
    <>
      <Breadcrumb title={"Checkout"} pages={["checkout"]} />
      <section className="overflow-hidden py-20 bg-gray-2">
        <div className="max-w-[1170px] w-full mx-auto px-4 sm:px-8 xl:px-0">
          <article className="max-w-[1170px] w-full mx-auto">
            <div className="flex flex-col lg:flex-row gap-7.5 xl:gap-11">
              {/* <!-- checkout left --> */}
              <div className="lg:max-w-[670px] w-full">
                {/* <!-- login box --> */}
                {!isAuthenticated && <Login />}

                {/* <!-- billing details --> */}
                <Billing
                  addresses={addresses}
                  selectedAddress={
                    addresses.find((address) => address.isDefault) ||
                    addresses[0]
                  }
                  billing={billing}
                  onChange={(field, value) =>
                    setBilling((prev) => ({ ...prev, [field]: value }))
                  }
                  onChangeAddress={handleChangrAddress}
                />

                {/* <!-- shipping to different address --> */}
                {/* <Shipping
                  shipping={shipping}
                  onChange={(field, value) =>
                    setShipping((prev) => ({ ...prev, [field]: value }))
                  }
                /> */}

                {/* <!-- others note box --> */}
                <div className="bg-white shadow-1 rounded-[10px] p-4 sm:p-8.5 mt-7.5">
                  <div>
                    <label htmlFor="notes" className="block mb-2.5">
                      Other Notes (optional)
                    </label>

                    <textarea
                      name="notes"
                      id="notes"
                      rows={5}
                      placeholder="Notes about your order, e.g. speacial notes for delivery."
                      className="rounded-md border border-gray-3 bg-gray-1 placeholder:text-dark-5 w-full p-5 outline-none duration-200 focus:border-transparent focus:shadow-input focus:ring-2 focus:ring-blue/20"
                    ></textarea>
                  </div>
                </div>
              </div>

              {/* // <!-- checkout right --> */}
              <div className="max-w-[455px] w-full">
                {/* <!-- order list box --> */}
                <div className="bg-white shadow-1 rounded-[10px]">
                  <div className="border-b border-gray-3 py-5 px-4 sm:px-8.5">
                    <h3 className="font-medium text-xl text-dark">
                      Your Order
                    </h3>
                  </div>

                  <div className="pt-2.5 pb-8.5 px-4 sm:px-8.5">
                    {/* <!-- title --> */}
                    <div className="flex items-center justify-between py-5 border-b border-gray-3">
                      <div>
                        <h4 className="font-medium text-dark">Product</h4>
                      </div>
                      <div>
                        <h4 className="font-medium text-dark text-right">
                          Subtotal
                        </h4>
                      </div>
                    </div>

                    {cartItems.map((cart, index) => {
                      return (
                        <div
                          key={index}
                          className="flex items-center justify-between py-5 border-b border-gray-3"
                        >
                          <div>
                            <p className="text-dark">{cart?.sku}</p>
                          </div>
                          <div>
                            <p className="text-dark text-right">
                              ${cart.price.toFixed(2)}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                    <div className="flex items-center justify-between py-5 border-b border-gray-3">
                      <div>
                        <p className="text-dark">SHIPPING FEE</p>
                      </div>
                      <div>
                        <p className="text-dark text-right">$1.2</p>
                      </div>
                    </div>

                    {/* <!-- discount --> */}
                    {discountAmount > 0 && (
                      <div className="flex items-center justify-between py-5 border-b border-gray-3">
                        <div>
                          <p className="text-dark">DISCOUNT</p>
                        </div>
                        <div>
                          <p className="text-green-500 text-right">
                            -${discountAmount.toFixed(2)}
                          </p>
                        </div>
                      </div>
                    )}

                    {/* <!-- total --> */}
                    <div className="flex items-center justify-between pt-5">
                      <div>
                        <p className="font-medium text-lg text-dark">Total</p>
                      </div>
                      <div>
                        <p className="font-medium text-lg text-dark text-right">
                          $
                          {Math.max(
                            0,
                            Number(totalPrice.toFixed(2)) +
                              1.2 -
                              discountAmount,
                          ).toFixed(2)}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* <!-- coupon box --> */}
                <Coupon onApplyCoupon={handleApplyCoupon} code={code || ""} />

                {/* <!-- shipping box --> */}
                <ShippingMethod />

                {/* <!-- payment box --> */}
                <PaymentMethod />

                {/* <!-- checkout button --> */}
                <button
                  onClick={handleCheckout}
                  className="w-full flex justify-center font-medium text-white bg-blue py-3 px-6 rounded-md ease-out duration-200 hover:bg-blue-dark mt-7.5"
                >
                  Process to Checkout
                </button>
              </div>
            </div>
          </article>
        </div>
      </section>
      <Toaster position="bottom-right" />
    </>
  );
};

export default Checkout;
