import api from "./axiosInstace";

// Fetch reviews for a product by product ID
export const getReviewsByProductId = async (productId: number) => {
    try {
        const response = await api.get(`/review/${productId}`);
        console.log("Fetched reviews:", response.data); // Log the fetched reviews
        return response.data;
    } catch (error) {
        console.error(`Error fetching reviews for product with id ${productId}:`, error);
        throw error;
    }
};
