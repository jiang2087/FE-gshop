import React, { useState, useEffect } from "react";
import { Address } from "@/redux/slices/addressSlice";

type BillingInfo = {
  recipientName: string;
  phone: string;
  address: string;
};

type BillingProps = {
  billing: BillingInfo;
  onChange: (field: keyof BillingInfo, value: string) => void;
  addresses: Address[];
  selectedAddress: Address | undefined;
  onChangeAddress: any;
};

const SelectAddressModal = ({
  isOpen,
  closeModal,
  addresses,
  onSelectAddress,
}: {
  isOpen: boolean;
  closeModal: () => void;
  addresses: Address[];
  onSelectAddress: (address: Address) => void;
}) => {
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (!(event.target as HTMLElement).closest(".modal-content")) {
        closeModal();
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, closeModal]);
if (!isOpen) return null;
  return (
    <div
      className={`fixed top-0 left-0 overflow-y-auto no-scrollbar w-full h-screen sm:py-20 xl:py-25 2xl:py-[230px] bg-dark/70 sm:px-8 px-4 py-5`}
    >
      <div className="flex items-center justify-center ">
        <div className="w-full max-w-[600px] rounded-xl shadow-3 bg-white p-7.5 relative modal-content">
          <button
            type="button"
            onClick={closeModal}
            aria-label="button for close modal"
            className="absolute top-0 right-0 sm:top-3 sm:right-3 flex items-center justify-center w-10 h-10 rounded-full ease-in duration-150 bg-meta text-body hover:text-dark"
          >
            <svg
              className="fill-current"
              width="26"
              height="26"
              viewBox="0 0 26 26"
              fill="currentColor"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M14.3108 13L19.2291 8.08167C19.5866 7.72417 19.5866 7.12833 19.2291 6.77083C19.0543 6.59895 18.8189 6.50262 18.5737 6.50262C18.3285 6.50262 18.0932 6.59895 17.9183 6.77083L13 11.6892L8.08164 6.77083C7.90679 6.59895 7.67142 6.50262 7.42623 6.50262C7.18104 6.50262 6.94566 6.59895 6.77081 6.77083C6.41331 7.12833 6.41331 7.72417 6.77081 8.08167L11.6891 13L6.77081 17.9183C6.41331 18.2758 6.41331 18.8717 6.77081 19.2292C7.12831 19.5867 7.72414 19.5867 8.08164 19.2292L13 14.3108L17.9183 19.2292C18.2758 19.5867 18.8716 19.5867 19.2291 19.2292C19.5866 18.8717 19.5866 18.2758 19.2291 17.9183L14.3108 13Z"
                fill=""
              />
            </svg>
          </button>

          <div>
            <h3 className="font-medium text-xl text-dark mb-5">
              Select Billing Address
            </h3>

            <div className="flex flex-col gap-4">
              {addresses?.map((address) => (
                <div
                  key={address.id}
                  onClick={() => {
                    onSelectAddress(address);
                    closeModal();
                  }}
                  className="p-4 border border-gray-3 rounded-lg cursor-pointer hover:border-blue duration-200 ease-in-out"
                >
                  <p className="font-medium text-dark mb-1">
                    {address.recipientName} {address.isDefault && <span className="text-sm text-blue ml-2">(Default)</span>}
                  </p>
                  <p className="text-dark-4 text-sm mb-1">{address.phone}</p>
                  <p className="text-dark-4 text-sm">{address.address}</p>
                </div>
              ))}
              {(!addresses || addresses.length === 0) && (
                <p className="text-dark-4">No addresses found.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};


const Billing = ({ billing, onChange, addresses, selectedAddress, onChangeAddress}: BillingProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentAddress, setCurrentAddress] = useState<Address | undefined>(selectedAddress);

  useEffect(() => {
    if (selectedAddress && !currentAddress) {
      setCurrentAddress(selectedAddress);
    }
    onChangeAddress(selectedAddress?.id)
  }, [selectedAddress]);

  const handleSelectAddress = (address: Address) => {
    setCurrentAddress(address);
    // Update the billing upstream as well if that affects the whole order processing
    onChangeAddress(address.id)
    onChange('recipientName', address.recipientName);
    onChange('phone', address.phone);
    onChange('address', address.address);
  };

  return (
    <div className="mt-9">
      <div className="flex items-center justify-between mb-5.5">
        <h2 className="font-medium text-dark text-xl sm:text-2xl">
          Billing details
        </h2>
        {addresses?.length > 0 && (
          <button
            type="button"
            onClick={() => setIsModalOpen(true)}
            className="text-blue hover:underline"
          >
            Change Address
          </button>
        )}
      </div>

      <div className="bg-white shadow-1 rounded-[10px] p-4 sm:p-8.5">
        <div className="mb-5">
          <label htmlFor="recipientName" className="block mb-2.5">
            Recipient Name <span className="text-red">*</span>
          </label>

          <input
            type="text"
            name="recipientName"
            id="recipientName"
            value={currentAddress?.recipientName || billing?.recipientName || ""}
            readOnly
            placeholder="Nguyen Van A"
            className="rounded-md border border-gray-3 bg-gray-1 placeholder:text-dark-5 w-full py-2.5 px-5 outline-none duration-200 focus:border-transparent focus:shadow-input focus:ring-2 focus:ring-blue/20 cursor-not-allowed"
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
            value={currentAddress?.phone || billing?.phone || ""}
            readOnly
            placeholder="09xxxxxxxx"
            className="rounded-md border border-gray-3 bg-gray-1 placeholder:text-dark-5 w-full py-2.5 px-5 outline-none duration-200 focus:border-transparent focus:shadow-input focus:ring-2 focus:ring-blue/20 cursor-not-allowed"
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
            value={currentAddress?.address || billing?.address || ""}
            readOnly
            placeholder="123 Nguyen Huu Tho, Phu Xuyen, Ha Noi"
            className="rounded-md border border-gray-3 bg-gray-1 placeholder:text-dark-5 w-full py-2.5 px-5 outline-none duration-200 focus:border-transparent focus:shadow-input focus:ring-2 focus:ring-blue/20 cursor-not-allowed"
          />
        </div>
      </div>

      <SelectAddressModal
        isOpen={isModalOpen}
        closeModal={() => setIsModalOpen(false)}
        addresses={addresses}
        onSelectAddress={handleSelectAddress}
      />
    </div>
  );
};

export default Billing;
