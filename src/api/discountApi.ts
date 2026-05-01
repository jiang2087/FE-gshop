import api from "@/api/axiosInstace";

export interface VoucherRequest {
  code: string;
  discountType: "FIXED" | "PERCENTAGE";
  discountValue: number;
  maxUsage?: number;
  minOrderValue?: number;
  maxDiscountAmount?: number;
  expiryDate?: string;
  description?: string;
}

export interface VoucherResponse {
  id: number;
  code: string;
  discountType: string;
  discountValue: number;
  maxUsage: number;
  usageCount: number;
  minOrderValue: number;
  maxDiscountAmount: number;
  expiryDate: string;
  description: string;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ApplyVoucherResponse {
  discount: number;
  finalAmount: number;
}

export interface DiscountRequest {
  name: string;
  description?: string;
  discountType: "FIXED" | "PERCENTAGE";
  discountValue: number;
  startDate?: string;
  endDate?: string;
  active: boolean;
}

export interface DiscountResponse {
  id: number;
  name: string;
  description: string;
  discountType: string;
  discountValue: number;
  startDate: string;
  endDate: string;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

// Create a new voucher
export const createVoucher = async (request: VoucherRequest) => {
  try {
    const response = await api.post("/vouchers", request);
    return response.data;
  } catch (error) {
    console.error("Error creating voucher:", error);
    throw error;
  }
};

// Collect/claim a voucher
export const collectVoucher = async (userId: number, code: string) => {
  try {
    const response = await api.post("/vouchers/collect", null, {
      params: {
        userId,
        code,
      },
    });
    return response.data;
  } catch (error) {
    console.error(`Error collecting voucher ${code}:`, error);
    throw error;
  }
};

// Apply voucher to calculate discount
export const applyVoucher = async (
  userId: number,
  code: string,
  orderTotal: number
) => {
  try {
    const response = await api.post("/apply", null, {
      params: {
        userId,
        code,
        orderTotal,
      },
    });
    return response.data;
  } catch (error) {
    console.error(`Error applying voucher ${code}:`, error);
    throw error;
  }
};
// ============== DISCOUNT ENDPOINTS ==============

// Create a new discount
export const createDiscount = async (request: DiscountRequest) => {
  try {
    const response = await api.post("/discounts", request);
    return response.data;
  } catch (error) {
    console.error("Error creating discount:", error.response?.data.message);
    throw error;
  }
};

// Apply discount to multiple product variants
export const applyDiscountToProducts = async (
  discountId: number,
  productVariantIds: number[]
) => {
  try {
    const response = await api.post(
      `/discounts/${discountId}/apply`,
      productVariantIds
    );
    return response.data;
  } catch (error) {
    console.error(
      `Error applying discount ${discountId} to products:`,
      error
    );
    throw error;
  }
};

// Get discounted price for a product variant
export const getDiscountedPrice = async (
  productVariantId: number,
  price: number
) => {
  try {
    const response = await api.get("/discounts/price", {
      params: {
        productVariantId,
        price,
      },
    });
    return response.data;
  } catch (error) {
    console.error(
      `Error getting discounted price for variant ${productVariantId}:`,
      error
    );
    throw error;
  }
};

// ============== VOUCHER LIST ENDPOINTS ==============

// Get all vouchers
export const getAllVouchers = async (): Promise<VoucherResponse[]> => {
  try {
    const response = await api.get("/vouchers");
    return response.data;
  } catch (error) {
    console.error("Error fetching all vouchers:", error);
    throw error;
  }
};

// Get top 5 vouchers
export const getTop5Vouchers = async (userId: number): Promise<VoucherResponse[]> => {
  try {
    const response = await api.get(`/vouchers/top-5/${userId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching top 5 vouchers:", error);
    throw error;
  }
};



// Preview voucher discount
export const getPreviewVoucher = async (
  code: string,
  userId: number,
  orderTotal: number
) => {
    const response = await api.get("vouchers/preview", {
      params: {
        code,
        userId,
        orderTotal,
      },
    });
    return response.data;
};
