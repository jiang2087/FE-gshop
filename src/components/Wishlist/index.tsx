"use client";
import React, { useEffect } from "react";
import Breadcrumb from "../Common/Breadcrumb";
import { useAppSelector, useAppDispatch } from "@/redux/store";
import SingleItem from "./SingleItem";
import { fetchWishlistThunk, removeAllItemsFromWishlist } from "@/redux/slices/wishlist-slice";

export const Wishlist = ({cartKey} : {cartKey: string}) => {
  const dispatch = useAppDispatch();
  const { items: wishlistItems, status } = useAppSelector((state) => state.wishlistReducer);

  useEffect(() => {
    // Gọi API lấy danh sách wishlist khi component được mount
    dispatch(fetchWishlistThunk());
  }, [dispatch]);

  const handleClearWishlist = () => {
    // Chạy action đồng bộ trên client hoặc cần tạo thêm API xoá tổng hợp nếu có
    dispatch(removeAllItemsFromWishlist());
  };

  return (
    <>
      <Breadcrumb title={"Wishlist"} pages={["Wishlist"]} />
      <section className="overflow-hidden py-20 bg-gray-2">
        <div className="max-w-[1170px] w-full mx-auto px-4 sm:px-8 xl:px-0">
          <div className="flex flex-wrap items-center justify-between gap-5 mb-7.5">
            <h2 className="font-medium text-dark text-2xl">Your Wishlist</h2>
            <button onClick={handleClearWishlist} className="text-blue">Clear Wishlist Cart</button>
          </div>

          {status === "loading" && (
            <div className="text-center py-5">Loading your wishlist...</div>
          )}
          {status === "failed" && (
            <div className="text-center py-5 text-red">Failed to load wishlist.</div>
          )}
          {status === "succeeded" && wishlistItems.length === 0 && (
            <div className="text-center py-5">Your wishlist is empty.</div>
          )}
          
          {wishlistItems.length > 0 && (

          <div className="bg-white rounded-[10px] shadow-1">
            <div className="w-full overflow-x-auto">
              <div className="min-w-[1170px]">
                {/* <!-- table header --> */}
                <div className="flex items-center py-5.5 px-10">
                  <div className="min-w-[83px]"></div>
                  <div className="min-w-[387px]">
                    <p className="text-dark">Product</p>
                  </div>

                  <div className="min-w-[205px]">
                    <p className="text-dark">Unit Price</p>
                  </div>

                  <div className="min-w-[265px]">
                    <p className="text-dark">Stock Status</p>
                  </div>

                  <div className="min-w-[150px]">
                    <p className="text-dark text-right">Action</p>
                  </div>
                </div>

                {/* <!-- wish item --> */}
                {wishlistItems.map((item, key) => (
                  <SingleItem cartKey={cartKey} item={item} key={key} />
                ))}
              </div>
            </div>
          </div>
          )}
        </div>
      </section>
    </>
  );
};
