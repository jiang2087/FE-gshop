import api from "@/api/axiosInstace";

export interface PaginationParams {
  page?: number;
  size?: number;
  sort?: string;
}

// Fetch all products with pagination
export const getAllProducts = async (params?: PaginationParams) => {
  try {
    const response = await api.get("/products", {
      params: {
        page: params?.page || 0,
        size: params?.size || 10,
        sort: params?.sort || "id,asc",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching products:", error);
    throw error;
  }
};

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

// Fetch product names by IDs
export const getNamesByIds = async (ids: number[]) => {
  try {
    const response = await api.get(`/products/names`, {
      params: {
        ids: ids.join(',')
      }
    });
    return response.data;
  } catch (error) {
    console.error(`Error fetching product names with ids ${ids.join(', ')}:`, error);
    throw error;
  }
};

export const getProductByType = async (types, params) => {
  try {
    const response = await api.get(`/products/type`, {
      params: {
        types: types, 
        page: params?.page || 0,
        size: params?.size || 9,
        sort: params?.sort || "id,asc",
      },
    });

    return response.data;

  } catch (error) {
    console.error("Error fetching products by type:", error);
    throw error;
  }
};


export const getProductTypeCount = async (types) => {
  try {
    const response = await api.get(`/products/type/count`, {
      params: {
        types: types,
      },
    });

    return response.data;

  } catch (error) {
    console.error("Error fetching product type count:", error);
    throw error;
  }
};


export const getProductsByPriceRange = async (types, min, max, params) => {
  try {
    const response = await api.get(`/products/price-range`, {
      params: {
        min,
        max,
        page: params?.page || 0,
        size: params?.size || 9,
        sort: params?.sort || "id,asc",
        ...(types && types.length > 0 && { types }),
      },
    });

    return response.data;

  } catch (error) {
    console.error("Error fetching products by price range:", error);
    throw error;
  }
};