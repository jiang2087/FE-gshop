import api from "@/api/axiosInstace";

// fetch products by id
export const getProductById = async (id: number) => {
  try {
    const response = await api.get(`/products/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching product with id ${id}:`, error);
    throw error;
  }
};


// Fetch all laptops
export const getAllLapop = async () => {
  try {
    const response = await api.get("/products/laptop");
    return response.data;
  } catch (error) {
    console.error("Error fetching laptops:", error);
    throw error;
  }
};


// Fetch laptop by ID
export const getLaptopById = async (id: number) => {
  try {
    const response = await api.get(`/products/laptop/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching laptop with id ${id}:`, error);
    throw error;
  }
};

export const getWishListByUserId = async (id: number) => {
  try {
    const response = await api.get(`/wishlist/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching wishlist with id ${id}:`, error);
    throw error;
  }
};


export const getWishlist = async (userId: number) => {
  try {
    const response = await api.get(`/wishlist/${userId}`);
    console.log("wishlist", response.data);
    return response.data;
  } catch (error) {
    console.error(`Error fetching wishlist for user ${userId}:`, error);
    throw error;
  }
};

export const addWishlist = async (userId: number, productId: number) => {
  try {
    const response = await api.post(`/wishlist`, null, {
      params: {
        userId,
        productId,
      },
    });
    return response.data;
  } catch (error) {
    console.error(`Error adding product ${productId} to wishlist:`, error);
    throw error;
  }
};


export const deleteWishlist = async (userId: number, productId: number) => {
  try {
    const response = await api.delete(`/wishlist`, {
      params: {
        userId,
        productId,
      },
    });
    return response.data;
  } catch (error) {
    console.error(`Error deleting product ${productId} from wishlist:`, error);
    throw error;
  }
};