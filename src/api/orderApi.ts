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

export const createOrder = async (payload: CreateOrderPayload) => {
    try {
        const response = await api.post('/orders', payload);
        return response.data;
    } catch (error) {
        console.error("Error creating order:", error);
        throw error;
    }
};

