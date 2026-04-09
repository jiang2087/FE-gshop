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