import React, { useEffect, useState } from "react";
import { useAppSelector } from "@/redux/store";
import { getUserUsableVouchers, UserVoucherResponse } from "@/api/discountApi";

const Coupon = ({ onApplyCoupon, code}: { onApplyCoupon: (code: string) => void, code: string}) => {
  const [couponCode, setCouponCode] = useState(code || "");
  const [vouchers, setVouchers] = useState<UserVoucherResponse[]>([]);
  const user = useAppSelector((state: any) => state.auth.user);

  useEffect(() => {
    const fetchVouchers = async () => {
      if (!user?.id) return;
      try {
        const data = await getUserUsableVouchers(user.id);
        setVouchers(data);
      } catch (error) {
        console.error("Failed to fetch vouchers:", error);
      }
    };
    fetchVouchers();
  }, [user?.id]);

  const handleApply = () => {
    if (onApplyCoupon && couponCode.trim()) {
      onApplyCoupon(couponCode.trim());
    }
  };

  useEffect(() => {
    if(code !== null && code !== ""){
      onApplyCoupon(code);
      setCouponCode(code);
    }
  }, [code]) // include code in dependency so if parent updates code it reflects

  return (
    <div className="bg-white shadow-1 rounded-[10px] mt-7.5">
      <div className="border-b border-gray-3 py-5 px-4 sm:px-8.5">
        <h3 className="font-medium text-xl text-dark">Have any Coupon Code?</h3>
      </div>

      <div className="py-8 px-4 sm:px-8.5">
        {vouchers.length > 0 && (
          <div className="mb-4">
            <select
              className="rounded-md border border-gray-3 bg-gray-1 w-full py-2.5 px-5 outline-none duration-200 focus:border-transparent focus:shadow-input focus:ring-2 focus:ring-blue/20 text-dark"
              onChange={(e) => setCouponCode(e.target.value)}
              value={couponCode}
            >
              <option value="">Select a voucher from your list</option>
              {vouchers.map(v => (
                <option key={v.id} value={v.code}>
                  {v.code} - {v.discountType === "PERCENTAGE" ? `${v.value}% OFF` : `$${v.value} OFF`} (Min Spend: ${v.minOrderValue})
                </option>
              ))}
            </select>
            <div className="text-center mt-3 mb-1 text-sm font-medium text-dark-4">OR ENTER CODE</div>
          </div>
        )}
        <div className="flex gap-4">
          <input
            type="text"
            name="coupon"
            id="coupon"
            placeholder="Enter coupon code"
            value={couponCode}
            onChange={(e) => setCouponCode(e.target.value)}
            className="rounded-md border border-gray-3 bg-gray-1 placeholder:text-dark-5 w-full py-2.5 px-5 outline-none duration-200 focus:border-transparent focus:shadow-input focus:ring-2 focus:ring-blue/20"
          />

          <button
            type="button"
            onClick={handleApply}
            className="inline-flex font-medium text-white bg-blue py-3 px-6 rounded-md ease-out duration-200 hover:bg-blue-dark"
          >
            Apply
          </button>
        </div>
      </div>
    </div>
  );
};

export default Coupon;
