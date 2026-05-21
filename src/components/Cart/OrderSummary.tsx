import { useAppSelector } from "@/redux/store";
import Link from "next/link";
import { getDiscountedPrice, findDiscountInfo, calcDiscountedSubtotal } from "@/utils/discountUtils";
const OrderSummary = ({
  discountAmount = 0,
  code,
  discounts,
}: {
  discountAmount?: number;
  code: string;
  discounts?: any;
}) => {
  const cartItems = useAppSelector((state) => state.cartReducer.items);

  const subtotal = calcDiscountedSubtotal(cartItems, discounts);

  return (
    <div className="lg:max-w-[455px] w-full">
      {/* <!-- order list box --> */}
      <div className="bg-white shadow-1 rounded-[10px]">
        <div className="border-b border-gray-3 py-5 px-4 sm:px-8.5">
          <h3 className="font-medium text-xl text-dark">Order Summary</h3>
        </div>

        <div className="pt-2.5 pb-8.5 px-4 sm:px-8.5">
          {/* <!-- title --> */}
          <div className="flex items-center justify-between py-5 border-b border-gray-3">
            <div>
              <h4 className="font-medium text-dark">Product</h4>
            </div>
            <div>
              <h4 className="font-medium text-dark text-right">Subtotal</h4>
            </div>
          </div>

          {/* <!-- product item --> */}
          {cartItems.map((item, key) => {
            const price = Number(item.price) || 0;
            const discountInfo = findDiscountInfo(discounts, item.productVariantId);
            const discountedPrice = getDiscountedPrice(price, discountInfo);
            const itemSubtotal = (discountedPrice ?? price) * item.quantity;

            return (
              <div
                key={key}
                className="flex items-center justify-between py-5 border-b border-gray-3"
              >
                <div>
                  <p className="text-dark">{item.sku}</p>
                </div>
                <div>
                  <p className="text-dark text-right">
                    ${itemSubtotal.toFixed(2)}
                  </p>
                </div>
              </div>
            );
          })}

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
                ${Math.max(0, subtotal - discountAmount).toFixed(2)}
              </p>
            </div>
          </div>

          {/* <!-- checkout button --> */}
          <Link
            href={{
              pathname: "/checkout",
              query: code ? {code} : {},
            }}
            type="submit"
            className="w-full flex justify-center font-medium text-white bg-blue py-3 px-6 rounded-md ease-out duration-200 hover:bg-blue-dark mt-7.5"
          >
            Process to Checkout
          </Link>
        </div>
      </div>
    </div>
  );
};

export default OrderSummary;
