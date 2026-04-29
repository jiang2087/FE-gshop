import React from "react";
import { CalendarDays } from "lucide-react";
import toast from "react-hot-toast";
import { useState } from "react";
import {collectVoucher} from "@/api/discountApi";

type Voucher = {
  active: boolean;
  code: string;
  discountType: "FIXED_AMOUNT" | "PERCENTAGE" | string;
  endDate: string;
  id: number;
  maxDiscount?: number;
  minOrderValue?: number;
  quantity: number;
  startDate: string;
  type: string;
  usedCount: number;
  value: number;
};

const formatCompactVnd = (amount = 0) => {
  if (amount >= 1000000)
    return `${(amount / 1000000).toFixed(amount % 1000000 === 0 ? 0 : 1)}M`;
  if (amount >= 1000) return `${Math.round(amount / 1000)}K`;
  return `${Math.round(amount)}`;
};

const formatDate = (date: string) =>
  new Date(date).toLocaleDateString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });

const SingleItem = ({ voucher, userId }: { voucher: Voucher, userId: number }) => {
  const now = new Date();
  const start = new Date(voucher.startDate);
  const end = new Date(voucher.endDate);
 const [saved, setSaved] = useState(false);
  const quantity = Math.max(0, voucher.quantity || 0);
  const usedCount = Math.min(
    Math.max(0, voucher.usedCount || 0),
    quantity || 0,
  );
  const remaining = Math.max(0, quantity - usedCount);
  const progressPercent =
    quantity > 0
      ? Math.min(100, Math.round((usedCount / quantity) * 100))
      : 100;

  const isExpired = now > end;
  const isUpcoming = now < start;
  const isOutOfStock = quantity > 0 ? usedCount >= quantity : true;
  const isUsable = voucher.active && !isExpired && !isUpcoming && !isOutOfStock;
  const isNearlyOut = isUsable && (remaining <= 5 || progressPercent >= 85);

  // Mapping: `value + discountType` -> text "Giảm 50K" / "Giảm 20%"
  const discountLabel =
    voucher.discountType === "FIXED_AMOUNT"
      ? (`Giảm ${formatCompactVnd(voucher.value)}`)
      
      : `Giảm ${Math.round(voucher.value)}%`;


  // Mapping: `active`, `endDate`, `usedCount/quantity` -> badge trạng thái
  const getStatus = () => {
    if (isExpired) {
      return {
        label: "Hết hạn",
        chip: "bg-red-50 text-red-700",
        tone: "border-red-200",
      };
    }

    if (isOutOfStock) {
      return {
        label: "Hết lượt",
        chip: "bg-slate-100 text-slate-700",
        tone: "border-slate-200",
      };
    }

    if (isNearlyOut) {
      return {
        label: "Sắp hết",
        chip: "bg-amber-50 text-amber-700",
        tone: "border-amber-200",
      };
    }

    if (isUsable) {
      return {
        label: "Còn hạn",
        chip: "bg-emerald-50 text-emerald-700",
        tone: "border-emerald-200",
      };
    }

    return {
      label: "Tạm khóa",
      chip: "bg-gray-100 text-gray-700",
      tone: "border-gray-200",
    };
  };

  const status = getStatus();
  const handleSaveVoucher = async () => {
    if (!isUsable) return;

    try {
      await navigator.clipboard.writeText(voucher.code);
      collectVoucher(userId, voucher.code);      
      setSaved(true);
      toast.success("Đã sao chép mã voucher");
    } catch {
      const textArea = document.createElement("textarea");
      let isCopiedByFallback = false;
      try {
        textArea.value = voucher.code;
        textArea.style.position = "fixed";
        textArea.style.opacity = "0";
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        isCopiedByFallback = document.execCommand("copy");
      } finally {
        if (document.body.contains(textArea)) {
          document.body.removeChild(textArea);
        }
      }

      if (isCopiedByFallback) {
        toast.success("Đã sao chép mã voucher");
      } else {
        toast.error("Không thể sao chép mã voucher");
      }
    }
  };
  return (
    <article
      className={`h-ful rounded-2xl text-dark bg-meta p-8 shadow-sm transition sm:p-4 ${status.tone} ${
        isUsable ? "hover:shadow-md" : "opacity-90"
      }`}
    >
      <div className="mb-3 flex items-start justify-between gap-3">
        <div className="min-w-0">
          {/* Mapping: `code` -> hiển thị mã voucher */}
          <p className="truncate text-xs font-semibold uppercase tracking-wide text-gray-500">
            {voucher.code}
          </p>
        </div>

        <span
          className={`shrink-0 rounded-full px-2.5 py-1 text-[11px] font-semibold ${status.chip}`}
        >
          {status.label}
        </span>
      </div>
      <svg
        width="100%"
        height="100%"
        className="mt-0 mb-4"
        viewBox="0 0 200 120"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Nền */}
        <rect
          x="0"
          y="0"
          width="200"
          height="120"
          rx="12"
          ry="12"
          fill="#DE5A40"
        />

        {/* Discount label ở giữa */}
        <text
          x="100"
          y="60"
          textAnchor="middle"
          dominantBaseline="middle"
          fontSize="36"
          fill="#FFFFFF"
          fontFamily="Arial"
          fontWeight="bold"
        >
          {voucher.type === "FREE_SHIP" ? "free ship" : discountLabel}
        </text>
      </svg>
      <div className="space-y-2.5 text-xs text-gray-600 sm:text-sm">
        {/* Mapping: `minOrderValue` -> "Đơn tối thiểu 200K" */}
        <p>
          Đơn tối thiểu:{" "}
          <span className="font-semibold text-gray-800">
            {formatCompactVnd(voucher.minOrderValue || 0)}
          </span>
        </p>

        {/* Mapping: `endDate` -> "HSD: ..." */}
        <div className="flex items-center gap-1.5">
          <CalendarDays className="h-3.5 w-3.5 text-gray-500 sm:h-4 sm:w-4" />
          <span className="truncate">HSD: {formatDate(voucher.endDate)}</span>
        </div>
      </div>

      <div className="mt-3">
        <div className="mb-1.5 flex items-center justify-between text-[11px] text-gray-500 sm:text-xs">
          {/* Mapping: `usedCount / quantity` -> progress usage */}
          <span>
            Đã dùng {usedCount}/{quantity}
          </span>
          <span>{progressPercent}%</span>
        </div>
        <div className="h-2 w-full overflow-hidden rounded-full bg-gray-100">
          <div
            className={`h-full rounded-full transition-all ${
              isExpired || isOutOfStock
                ? "bg-gray-400"
                : isNearlyOut
                  ? "bg-amber-500"
                  : "bg-emerald-500"
            }`}
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      <button
        type="button"
        disabled={!isUsable}
        onClick={handleSaveVoucher}
        className={`mt-4 text-red-light-3 flex w-full items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition ${
          isUsable
            ? "bg-gray-900 text-dark hover:bg-black"
            : "cursor-not-allowed bg-gray-200 text-gray-500"
        }`}
        style={{
            background: saved ? 'bg-meta-4' : '#2296f3',
            color: 'white',
            cursor: saved ? 'not-allowed' : 'pointer',
          }}
      >
        {/* CTA: usable -> "Dùng ngay", non-usable -> "Lưu" */}
        <img
          width="20"
          height="20"
          src="https://img.icons8.com/dusk/64/discount-ticket.png"
          alt="discount-ticket"
        />
       {saved ? 'Đã lưu' : 'Lưu'}
      </button>
    </article>
  );
};

export default SingleItem;

