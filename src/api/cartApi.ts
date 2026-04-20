import api from '@/api/axiosInstace';

export const getCart = async (cartId: number) => {
    try {
        const response = await api.get(`/cart/${cartId}`);
        return response.data;
    } catch (error) {
        console.error(`Error fetching cart with id ${cartId}:`, error);
        throw error;
    }
};

export const getCartTotal = async (cartId: number) => {
    try {
        const response = await api.get(`/cart/total/${cartId}`);
        return response.data;
    } catch (error) {
        console.error(`Error fetching total for cart ${cartId}:`, error);
        throw error;
    }
};


export const addToCart = async (
    cartKey: string,
    productVariantId: number,
    quantity: number
) => {
    try {
        const response = await api.post(`/cart`, null, {
            params: {
                cartKey,
                productVariantId,
                quantity,
            },
        });
        return response.data;
    } catch (error) {
        console.error("Error adding to cart:", error);
        throw error;
    }
};

export const updateCartItem = async (
    cartItemId: number,
    quantity: number
) => {
    try {
        await api.put(`/cart/cart-item/${cartItemId}`, null, {
            params: { quantity },
        });
    } catch (error) {
        console.error(`Error updating cart item ${cartItemId}:`, error);
        throw error;
    }
};


export const deleteCartItem = async (cartItemId: number) => {
    try {
        await api.delete(`/cart/cart-item`, {
            params: { cartItemId },
        });
    } catch (error) {
        console.error(`Error deleting cart item ${cartItemId}:`, error);
        throw error;
    }
};


export const clearCart = async (cartId: number) => {
    try {
        await api.delete(`/cart/${cartId}`);
    } catch (error) {
        console.error(`Error clearing cart ${cartId}:`, error);
        throw error;
    }
};