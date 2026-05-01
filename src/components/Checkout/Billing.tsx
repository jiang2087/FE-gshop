import React from "react";

type BillingInfo = {
  recipientName: string;
  phone: string;
  address: string;
};

type BillingProps = {
  billing: BillingInfo;
  onChange: (field: keyof BillingInfo, value: string) => void;
  addresses: any; // Assuming addresses is an array of strings
};

const Billing = ({ billing, addresses }: BillingProps) => {
  return (
    <div className="mt-9">
      <h2 className="font-medium text-dark text-xl sm:text-2xl mb-5.5">
        Billing details
      </h2>

      <div className="bg-white shadow-1 rounded-[10px] p-4 sm:p-8.5">
        <div className="mb-5">
          <label htmlFor="recipientName" className="block mb-2.5">
            Recipient Name <span className="text-red">*</span>
          </label>

          <input
            type="text"
            name="recipientName"
            id="recipientName"
            value={addresses?.recipientName || "recipient name"}
            readOnly
            placeholder="Nguyen Van A"
            className="rounded-md border border-gray-3 bg-gray-1 placeholder:text-dark-5 w-full py-2.5 px-5 outline-none duration-200 focus:border-transparent focus:shadow-input focus:ring-2 focus:ring-blue/20"
          />
        </div>

        <div className="mb-5">
          <label htmlFor="phone" className="block mb-2.5">
            Phone <span className="text-red">*</span>
          </label>

          <input
            type="text"
            name="phone"
            id="phone"
            value={addresses?.phone || "09xxxxxxxx"}
            readOnly
            placeholder="09xxxxxxxx"
            className="rounded-md border border-gray-3 bg-gray-1 placeholder:text-dark-5 w-full py-2.5 px-5 outline-none duration-200 focus:border-transparent focus:shadow-input focus:ring-2 focus:ring-blue/20"
          />
        </div>

        <div className="mb-5.5">
          <label htmlFor="address" className="block mb-2.5">
            Address <span className="text-red">*</span>
          </label>

          <input
            type="text"
            name="address"
            id="address"
            value={addresses?.address || "address"}
            readOnly
            placeholder="123 Nguyen Huu Tho, Phu Xuyen, Ha Noi"
            className="rounded-md border border-gray-3 bg-gray-1 placeholder:text-dark-5 w-full py-2.5 px-5 outline-none duration-200 focus:border-transparent focus:shadow-input focus:ring-2 focus:ring-blue/20"
          />
        </div>
      </div>
    </div>
  );
};

export default Billing;
