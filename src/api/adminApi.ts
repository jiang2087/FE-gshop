import api from '@/api/axiosInstace';

export interface PaginationParams {
    page?: number;
    size?: number;
    sort?: SortParam;
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