import api from './axiosInstace';

export interface OrderItem {
    variantId: number;
    quantity: number;
}

export interface CreateOrderPayload {
    userId: number;
    addressId: number;
    items: OrderItem[];
    paymentMethod: string;
    note?: string;
    voucherCode?: string;
}

export enum OrderStatus {
    PENDING = "PENDING",
    PROCESSING = "PROCESSING",
    SHIPPED = "SHIPPED",
    COMPLETED = "COMPLETED",
    CANCELLED = "CANCELLED"
}

export interface Order {
    id: number;
    orderCode: string;
    status: OrderStatus;
    totalPrice: number;
    shippingFee: number;
    discountAmount: number;
    createdAt: string;
}

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

export const createOrder = async (payload: CreateOrderPayload) => {
    try {
        const response = await api.post('/orders', payload);
        return response.data;
    } catch (error) {
        console.error("Error creating order:", error);
        throw error;
    }
};


export const getMyOrders = async (): Promise<Order[]> => {
    try {
        const response = await api.get("/orders/me");
        return response.data;
    } catch (error) {
        console.error("Error fetching my orders:", error);
        throw error;
    }
};

export const updateMyOrderStatus = async (
    orderId: number,
    status: string
) => {
    try {
        const response = await api.put(
            `/orders/me/${orderId}/status`,
            null,
            {
                params: {
                    status,
                },
            }
        );

        return response.data;
    } catch (error) {
        console.error("Error updating order status:", error);
        throw error;
    }
};