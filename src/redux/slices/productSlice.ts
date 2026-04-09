import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface Product {
  id: string;
  name: string;
  price: number;
  category: string;
  stock: number;
  createdAt: string;
}

interface ProductState {
  items: Product[];
  searchQuery: string;
  currentPage: number;
}

const initialState: ProductState = {
  items: [
    { id: "1", name: "iPhone 15 Pro", price: 2500, category: "Mobile", stock: 10, createdAt: new Date().toISOString() },
    { id: "2", name: "MacBook M3", price: 4500, category: "Laptop", stock: 5, createdAt: new Date().toISOString() },
    { id: "3", name: "Samsung Galaxy S24", price: 2200, category: "Mobile", stock: 15, createdAt: new Date().toISOString() },
    { id: "4", name: "iPad Pro 12.9", price: 1800, category: "Tablet", stock: 8, createdAt: new Date().toISOString() },
    { id: "5", name: "AirPods Pro", price: 400, category: "Audio", stock: 25, createdAt: new Date().toISOString() },
    { id: "6", name: "Dell XPS 15", price: 4200, category: "Laptop", stock: 6, createdAt: new Date().toISOString() },
    { id: "7", name: "Google Pixel 8", price: 1900, category: "Mobile", stock: 12, createdAt: new Date().toISOString() },
    { id: "8", name: "Sony WH-1000XM5", price: 350, category: "Audio", stock: 20, createdAt: new Date().toISOString() },
  ],
  searchQuery: "",
  currentPage: 1,
};

export const productSlice = createSlice({
  name: "products",
  initialState,
  reducers: {
    addProduct: (state, action: PayloadAction<Product>) => {
      state.items.unshift(action.payload);
    },
    updateProduct: (state, action: PayloadAction<Product>) => {
      const index = state.items.findIndex((p) => p.id === action.payload.id);
      if (index !== -1) state.items[index] = action.payload;
    },
    deleteProduct: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter((p) => p.id !== action.payload);
    },
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload;
      state.currentPage = 1;
    },
    setCurrentPage: (state, action: PayloadAction<number>) => {
      state.currentPage = action.payload;
    },
  },
});

export const { addProduct, updateProduct, deleteProduct, setSearchQuery, setCurrentPage } = productSlice.actions;
export default productSlice.reducer;