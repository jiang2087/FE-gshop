import React, { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/redux/store";
import {
  addAddress,
  updateAddress,
  Address,
} from "@/redux/slices/addressSlice";

type AddressModalProps = {
  isOpen: boolean;
  closeModal: () => void;
  editingAddress: Address | null;
};

const AddressModal = ({
  isOpen,
  closeModal,
  editingAddress,
}: AddressModalProps) => {
  const dispatch = useAppDispatch();
  const { loading } = useAppSelector((state) => state.address);
  const { user } = useAppSelector((state) => state.auth);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");

  useEffect(() => {
    // closing modal while clicking outside
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

  // Reset form when modal opens
  useEffect(() => {
    if (isOpen) {
      if (editingAddress) {
        setName(editingAddress.recipientName);
        setPhone(editingAddress.phone);
        setAddress(editingAddress.address);
      } else {
        setName("");
        setPhone("");
        setAddress("");
      }
    }
  }, [isOpen, editingAddress]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim() || !phone.trim() || !address.trim()) {
      return;
    }

    try {
      if (editingAddress) {
        await dispatch(
          updateAddress({
            userId: user?.id as number,
            addressData: {
              id: editingAddress.id,
              recipientName: name.trim(),
              phone: phone.trim(),
              address: address.trim(),
              isDefault: editingAddress.isDefault,
            }
          },)
        ).unwrap();
      } else {
        await dispatch(
          addAddress({
            addressData: {
              recipientName: name.trim(),
              phone: phone.trim(),
              address: address.trim(),
            },
            userId: user?.id as number,
          }),
        ).unwrap();
      }
      closeModal();
    } catch {
      // error is handled in Redux state
    }
  };

  return (
    <div
      className={`fixed top-0 left-0 overflow-y-auto no-scrollbar w-full h-screen sm:py-20 xl:py-25 2xl:py-[230px] bg-dark/70 sm:px-8 px-4 py-5 ${
        isOpen ? "block z-99999" : "hidden"
      }`}
    >
      <div className="flex items-center justify-center ">
        <div className="w-full max-w-[600px] rounded-xl shadow-3 bg-white p-7.5 relative modal-content">
          <button
            onClick={closeModal}
            aria-label="button for close modal"
            className="absolute top-0 right-0 sm:top-3 sm:right-3 flex items-center justify-center w-10 h-10 rounded-full ease-in duration-150 bg-meta text-body hover:text-dark"
          >
            <svg
              className="fill-current"
              width="26"
              height="26"
              viewBox="0 0 26 26"
              fill="none"
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
              {editingAddress ? "Edit Address" : "Add New Address"}
            </h3>

            <form onSubmit={handleSubmit}>
              <div className="mb-5">
                <label htmlFor="name" className="block mb-2.5">
                  recipient name <span className="text-red">*</span>
                </label>
                <input
                  type="text"
                  name="name"
                  id="name"
                  placeholder="Enter recipient's name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="rounded-md border border-gray-3 bg-gray-1 placeholder:text-dark-5 w-full py-2.5 px-5 outline-none duration-200 focus:border-transparent focus:shadow-input focus:ring-2 focus:ring-blue/20"
                  required
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
                  placeholder="Enter phone number"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="rounded-md border border-gray-3 bg-gray-1 placeholder:text-dark-5 w-full py-2.5 px-5 outline-none duration-200 focus:border-transparent focus:shadow-input focus:ring-2 focus:ring-blue/20"
                  required
                />
              </div>

              <div className="mb-5">
                <label htmlFor="address" className="block mb-2.5">
                  Address <span className="text-red">*</span>
                </label>
                <textarea
                  name="address"
                  id="address"
                  placeholder="Enter detailed address"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  rows={3}
                  className="rounded-md border border-gray-3 bg-gray-1 placeholder:text-dark-5 w-full py-2.5 px-5 outline-none duration-200 focus:border-transparent focus:shadow-input focus:ring-2 focus:ring-blue/20 resize-none"
                  required
                />
              </div>

              <div className="flex items-center gap-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="inline-flex font-medium text-white bg-blue py-3 px-7 rounded-md ease-out duration-200 hover:bg-blue-dark disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading
                    ? "Saving..."
                    : editingAddress
                      ? "Update Address"
                      : "Add Address"}
                </button>

                <button
                  type="button"
                  onClick={closeModal}
                  className="inline-flex font-medium text-dark-2 bg-gray-1 border border-gray-3 py-3 px-7 rounded-md ease-out duration-200 hover:bg-gray-2"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddressModal;
