import api from '@/api/axiosInstace';

export interface PaginationParams {
    page?: number;
    size?: number;
    sort?: SortParam;
    status?: string;
    orderCode?: string;
    keyword?: string;
}

export interface SortParam {
    field: string;
    direction: "asc" | "desc";
}

export const getTotalUsers = async () => {
    try {
        const response = await api.get(`/users/total`);
        return response.data;
    } catch (error) {
        console.error(error);
        throw error;
    }
};

export const getProfitThisMonth = async () => {
    try {
        const response = await api.get(`orders/profit/month`);
        return response.data;
    } catch (error) {
        console.error(error);
        throw error;
    }
};

export const getProfitPerMonth = async () => {
    try {
        const response = await api.get(`orders/profit/per-month`);
        return response.data;
    } catch (error) {
        console.error(error);
        throw error;
    }
};

export const countProductVariants = async () => {
    try {
        const response = await api.get(`products/count`);
        return response.data;
    } catch (error) {
        console.error(error);
        throw error;
    }
};

export const getProfitPerDay = async (timeFrame) => {
    try {
        const response = await api.get(`orders/profit/per-day`, {
            params: { timeFrame }
        });
        return response.data;
    } catch (error) {
        console.error(error);
        throw error;
    }
};


export const getTopProducts = async (page: number = 0, size: number = 10) => {
    try {
        const response = await api.get(`products/top`, {
            params: { page, size }
        });
        return response.data;
    } catch (error) {
        throw error;
    }
};
export const getAllProducts = async (params?: PaginationParams) => {
    const sort =
        typeof params?.sort === "string"
            ? params.sort
            : params?.sort
                ? `${params.sort.field},${params.sort.direction}`
                : undefined;

    const response = await api.get("/products", {
        params: {
            page: params?.page ?? 0,
            size: params?.size ?? 10,
            ...(sort ? { sort } : {}),
        },
    });

    return response.data;
};

export const searchProducts = async (keyword?: string, page: number = 0, size: number = 10) => {
    try {
        const response = await api.get("/products/search", {
            params: { keyword, page, size }
        });
        return response.data;
    } catch (error) {
        console.error("Error searching products:", error);
        throw error;
    }
};
export const deleteProduct = async (id: number) => {
    try {
        const response = await api.delete(`/products/${id}`);
        return response.data;
    } catch (error) {
        console.error("Error deleting product:", error);
        throw error;
    }
};

export const updateProduct = async (id: number, data: any) => {
    try {
        const response = await api.put(`/products/${id}`, data);
        return response.data;
    } catch (error) {
        console.error("Error updating product:", error);
        throw error;
    }
};
export const createProduct = async (data: any) => {
    try {
        const response = await api.post("/products", data);
        return response.data;
    } catch (error) {
        console.error("Error creating product:", error);
        throw error;
    }
};

export const getColors = async () => {
    try {
        const response = await api.get("/colors");
        return response.data;
    } catch (error) {
        console.error("Error fetching colors:", error);
        throw error;
    }
};

export const deleteColor = async (id: number) => {
    try {
        const response = await api.delete(`/colors/${id}`);
        return response.data;
    } catch (error) {
        console.error("Error deleting color:", error);
        throw error;
    }
};




export interface VariantRequest {
    price: number;
    hexCode?: string;
    colorName?: string;
    image?: string;
    stock?: number;
    isDefault?: boolean;
}

export const createVariant = async (productId: number, data: VariantRequest) => {
    try {
        const response = await api.post(`/products/${productId}/variants`, data);
        return response.data;
    } catch (error) {
        console.error("Error creating variant:", error);
        throw error;
    }
};

export const updateVariant = async (variantId: number, data: VariantRequest) => {
    try {
        const response = await api.put(`/products/variants/${variantId}`, data);
        return response.data;
    } catch (error) {
        console.error("Error updating variant:", error);
        throw error;
    }
};

export const deleteVariant = async (variantId: number) => {
    try {
        const response = await api.delete(`/products/variants/${variantId}`);
        return response.data;
    } catch (error) {
        console.error("Error deleting variant:", error);
        throw error;
    }
};

export interface UpdateUserRequest {
    username: string;
    email?: string;
    imageUrl?: string;
    currentPassword?: string;
    newPassword?: string;
}

export const updateUser = async (userId: number, data: UpdateUserRequest) => {
    try {
        const response = await api.put(`/users/${userId}`, data);
        return response.data;
    } catch (error) {
        console.error("Error updating user:", error);
        throw error;
    }
};

export const getAllOrders = async (params?: PaginationParams) => {
    const sort =
        typeof params?.sort === "string"
            ? params.sort
            : params?.sort
                ? `${params.sort.field},${params.sort.direction}`
                : undefined;

    const response = await api.get("/orders", {
        params: {
            page: params?.page ?? 0,
            size: params?.size ?? 10,
            status: params?.status,
            orderCode: params?.orderCode,
            ...(sort ? { sort } : {}),
        },
    });

    return response.data;
};

export const deleteOrderAdmin = async (id: number) => {
    try {
        const response = await api.delete(`/orders/admin/${id}`);
        return response.data;
    } catch (error) {
        console.error("Error deleting order:", error);
        throw error;
    }
};

export interface OrderItemResponse {
    id: number;
    productName: string;
    image: string;
    sku: string;
    quantity: number;
    price: number;
    subtotal: number;
}

export const getOrderItems = async (orderId: number): Promise<OrderItemResponse[]> => {
    try {
        const response = await api.get(`/orders/${orderId}/items`);
        return response.data;
    } catch (error) {
        console.error("Error fetching order items:", error);
        throw error;
    }
};

export type OrderStatus =
    | "PENDING"
    | "PROCESSING"
    | "SHIPPED"
    | "COMPLETED"
    | "CANCELLED";

export const updateOrderStatus = async (
    orderId: number,
    status: OrderStatus) => {
    try {
        const response = await api.put(`/orders/${orderId}/status`, null, {
            params: { status }
        });
        return response.data;
    } catch (error) {
        console.error("Error updating order status:", error);
        throw error;
    }
};


export const getDiscountOrder = async (orderId: number) => {
    try {
        const response = await api.get(`/orders/${orderId}/discount`);
        return response.data;
    } catch (error) {
        console.error("Error fetching order discount:", error);
        throw error;
    }
};

export interface DiscountAdminResponse {
    id: number;
    name: string;
    type: "FIXED_AMOUNT" | "PERCENTAGE";
    value: number;
    startDate: string;
    endDate: string;
    active: boolean;
}

export interface VoucherAdminResponse {
    id: number;
    code: string;
    type: "SHIPPING" | "PRODUCT"; // Example VoucherType
    discountType: "FIXED_AMOUNT" | "PERCENTAGE";
    value: number;
    minOrderValue: number;
    maxDiscount: number;
    quantity: number;
    usedCount: number;
    startDate: string;
    endDate: string;
    active: boolean;
}

export const getAllDiscounts = async (params?: PaginationParams) => {
    const sort =
        typeof params?.sort === "string"
            ? params.sort
            : params?.sort
                ? `${params.sort.field},${params.sort.direction}`
                : undefined;

    const response = await api.get("/discounts", {
        params: {
            page: params?.page ?? 0,
            size: params?.size ?? 5,
            name: params?.keyword || undefined,
            active: params?.status?.toLowerCase() === "active" ? true : params?.status?.toLowerCase() === "inactive" ? false : undefined,
            ...(sort ? { sort } : {}),
        },
    });

    return response.data;
};

export const getAllVouchers = async (params?: PaginationParams) => {
    const sort =
        typeof params?.sort === "string"
            ? params.sort
            : params?.sort
                ? `${params.sort.field},${params.sort.direction}`
                : undefined;

    const response = await api.get("/vouchers", {
        params: {
            page: params?.page ?? 0,
            size: params?.size ?? 5,
            voucherCode: params?.keyword || undefined,
            active: params?.status?.toLowerCase() === "active" ? true : params?.status?.toLowerCase() === "inactive" ? false : undefined,
            ...(sort ? { sort } : {}),
        },
    });

    return response.data;
};

// Discount CRUD
export interface DiscountRequest {
    name: string;
    type: "FIXED_AMOUNT" | "PERCENTAGE";
    value: number;
    startDate: string;
    endDate: string;
    active: boolean;
}

export const createDiscount = async (data: DiscountRequest) => {
    try {
        const response = await api.post("/discounts", data);
        return response.data;
    } catch (error) {
        console.error("Error creating discount:", error);
        throw error;
    }
};

export const updateDiscount = async (id: number, data: DiscountRequest) => {
    try {
        const response = await api.put(`/discounts/${id}`, data);
        return response.data;
    } catch (error) {
        console.error("Error updating discount:", error);
        throw error;
    }
};

export const deleteDiscount = async (id: number) => {
    try {
        const response = await api.delete(`/discounts/${id}`);
        return response.data;
    } catch (error) {
        console.error("Error deleting discount:", error);
        throw error;
    }
};

// Voucher CRUD
export interface VoucherRequest {
    code: string;
    type: "SHIPPING" | "PRODUCT";
    discountType: "FIXED_AMOUNT" | "PERCENTAGE";
    value: number;
    minOrderValue: number;
    maxDiscount: number;
    quantity: number;
    startDate: string;
    endDate: string;
    active: boolean;
}

export const createVoucher = async (data: VoucherRequest) => {
    try {
        const response = await api.post("/vouchers", data);
        return response.data;
    } catch (error) {
        console.error("Error creating voucher:", error);
        throw error;
    }
};

export const updateVoucher = async (id: number, data: VoucherRequest) => {
    try {
        const response = await api.put(`/vouchers/${id}`, data);
        return response.data;
    } catch (error) {
        console.error("Error updating voucher:", error);
        throw error;
    }
};

export const deleteVoucher = async (id: number) => {
    try {
        const response = await api.delete(`/vouchers/${id}`);
        return response.data;
    } catch (error) {
        console.error("Error deleting voucher:", error);
        throw error;
    }
};