import React, { useState } from "react";

export type ShippingInfo = {
  recipientName: string;
  phone: string;
  address: string;
};

type ShippingProps = {
  shipping: ShippingInfo;
  onChange: (field: keyof ShippingInfo, value: string) => void;
};

const Shipping = ({ shipping, onChange }: ShippingProps) => {
  const [dropdown, setDropdown] = useState(false);

  return (
    <div className="bg-white shadow-1 rounded-[10px] mt-7.5">
      <div
        onClick={() => setDropdown(!dropdown)}
        className="cursor-pointer flex items-center gap-2.5 font-medium text-lg text-dark py-5 px-5.5"
      >
        Ship to a different address?
        <svg
          className={`fill-current ease-out duration-200 ${
            dropdown && "rotate-180"
          }`}
          width="22"
          height="22"
          viewBox="0 0 22 22"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M4.06103 7.80259C4.30813 7.51431 4.74215 7.48092 5.03044 7.72802L10.9997 12.8445L16.9689 7.72802C17.2572 7.48092 17.6912 7.51431 17.9383 7.80259C18.1854 8.09088 18.1521 8.5249 17.8638 8.772L11.4471 14.272C11.1896 14.4927 10.8097 14.4927 10.5523 14.272L4.1356 8.772C3.84731 8.5249 3.81393 8.09088 4.06103 7.80259Z"
            fill=""
          />
        </svg>
      </div>

      {dropdown && (
        <div className="p-4 sm:p-8.5 border-t border-gray-3">
          <div className="mb-5">
            <label htmlFor="shippingRecipientName" className="block mb-2.5">
              Recipient Name <span className="text-red">*</span>
            </label>
            <input
              type="text"
              name="shippingRecipientName"
              id="shippingRecipientName"
              value={shipping.recipientName}
              onChange={(e) => onChange("recipientName", e.target.value)}
              placeholder="Nguyen Van A"
              className="rounded-md border border-gray-3 bg-gray-1 placeholder:text-dark-5 w-full py-2.5 px-5 outline-none duration-200 focus:border-transparent focus:shadow-input focus:ring-2 focus:ring-blue/20"
            />
          </div>

          <div className="mb-5">
            <label htmlFor="shippingPhone" className="block mb-2.5">
              Phone <span className="text-red">*</span>
            </label>
            <input
              type="text"
              name="shippingPhone"
              id="shippingPhone"
              value={shipping.phone}
              onChange={(e) => onChange("phone", e.target.value)}
              placeholder="09xxxxxxxx"
              className="rounded-md border border-gray-3 bg-gray-1 placeholder:text-dark-5 w-full py-2.5 px-5 outline-none duration-200 focus:border-transparent focus:shadow-input focus:ring-2 focus:ring-blue/20"
            />
          </div>

          <div className="mb-5">
            <label htmlFor="shippingAddress" className="block mb-2.5">
              Address <span className="text-red">*</span>
            </label>
            <input
              type="text"
              name="shippingAddress"
              id="shippingAddress"
              value={shipping.address}
              onChange={(e) => onChange("address", e.target.value)}
              placeholder="123 Nguyen Huu Tho, Phu Xuyen, Ha Noi"
              className="rounded-md border border-gray-3 bg-gray-1 placeholder:text-dark-5 w-full py-2.5 px-5 outline-none duration-200 focus:border-transparent focus:shadow-input focus:ring-2 focus:ring-blue/20"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default Shipping;
