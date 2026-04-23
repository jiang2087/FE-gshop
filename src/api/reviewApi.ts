import api from "./axiosInstace";

// Fetch reviews for a product by product ID
export const getReviewsByProductId = async (productId: number) => {
    try {
        const response = await api.get(`/review/${productId}`);
        return response.data;
    } catch (error) {
        console.error(`Error fetching reviews for product with id ${productId}:`, error);
        throw error;
    }
};

// Fetch review stats for multiple products
export const getReviewStats = async (productIds: number[]) => {
    try {
        const response = await api.get(`/review/stats`, {
            params: {
                productIds: productIds.join(',')
            }
        });
        return response.data;
    } catch (error) {
        console.error("Error fetching review stats:", error);
        throw error;
    }
};

export const getLikebyUserIdAndProductId = async (userId: number, productId: number) => {
    try {
        const response = await api.get(`/review?userId=${userId}&productId=${productId}`);
        console.log("Response from getLikebyUserIdAndProductId:", response.data);
        return response.data;
    } catch (error) {
        console.error(`Error fetching reviews for product with id ${productId} and user with id ${userId}:`, error);
        throw error;
    }
};

export const createReview = async (data: any) => {
    try {
        const response = await api.post(`/review`, data);
        return response.data;
    } catch (error) {
        console.error("Error creating review:", error);
        throw error;
    }
};

export const toggleReviewHelpful = async (reviewId: number, userId: number) => {
    try {
        const response = await api.post(`/review/helpful`, null, {
            params: { reviewId, userId }
        });
        return response.data;
    } catch (error) {
        console.error("Error toggling helpful:", error);
        throw error;
    }
};

export const updateReview = async (
    reviewId: number,
    userId: number,
    data: any
) => {
    try {
        const response = await api.put(`/review`, data, {
            params: { reviewId, userId }
        });
        return response.data;
    } catch (error) {
        console.error("Error updating review:", error);
        throw error;
    }
};
export const deleteReview = async (reviewId: number) => {
    try {
        const response = await api.delete(`/review/${reviewId}`);
        return response.data;
    } catch (error) {
        console.error(`Error deleting review with id ${reviewId}:`, error);
        throw error;
    }
};

export const getTopReviews = async (
    page: number = 0,
    size: number = 6,
    sort: string = "createdAt,desc"
) => {
    try {
        const response = await api.get(`/review/top`, {
            params: {
                page,
                size,
                sort
            }
        });
        return response.data;
    } catch (error) {
        console.error("Error fetching top reviews:", error);
        throw error;
    }
};

export const reviewApi = {
    getReviewsByProductId,
    getReviewStats,
    createReview,
    updateReview,
    deleteReview,
    toggleReviewHelpful,
    getLikebyUserIdAndProductId,
    getTopReviews
};