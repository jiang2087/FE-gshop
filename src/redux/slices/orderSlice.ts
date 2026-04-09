import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../api/axiosInstace";

export type OrderItem = {
  id: number;
  title: string;
  price: number;
  discountedPrice: number;
  quantity: number;
};

export type Order = {
  id: string;
  orderNumber: string;
  items: OrderItem[];
  totalPrice: number;
  status: "pending" | "confirmed" | "shipped" | "delivered" | "cancelled";
  createdAt: string;
  updatedAt: string;
  shippingAddress?: string;
  paymentMethod?: string;
};

type OrderState = {
  orders: Order[];
  loading: boolean;
  error: string | null;
};

const initialState: OrderState = {
  orders: [],
  loading: false,
  error: null,
};

// Fetch all orders
export const fetchOrders = createAsyncThunk<
  Order[],
  void,
  { rejectValue: string }
>("order/fetchAll", async (_, { rejectWithValue }) => {
  try {
    const response = await api.get("/orders");
    return response.data;
  } catch (err: any) {
    const message =
      err.response?.data?.message || "Không thể tải danh sách đơn hàng.";
    return rejectWithValue(message);
  }
});

// Fetch single order by ID
export const fetchOrderById = createAsyncThunk<
  Order,
  string,
  { rejectValue: string }
>("order/fetchById", async (orderId, { rejectWithValue }) => {
  try {
    const response = await api.get(`/orders/${orderId}`);
    return response.data;
  } catch (err: any) {
    const message =
      err.response?.data?.message || "Không thể tải đơn hàng.";
    return rejectWithValue(message);
  }
});

// Create new order
export const createOrder = createAsyncThunk<
  Order,
  Omit<Order, "id" | "orderNumber" | "createdAt" | "updatedAt">,
  { rejectValue: string }
>("order/create", async (orderData, { rejectWithValue }) => {
  try {
    const response = await api.post("/orders", orderData);
    return response.data;
  } catch (err: any) {
    const message =
      err.response?.data?.message || "Tạo đơn hàng thất bại.";
    return rejectWithValue(message);
  }
});

// Update order status
export const updateOrderStatus = createAsyncThunk<
  Order,
  { orderId: string; status: Order["status"] },
  { rejectValue: string }
>("order/updateStatus", async ({ orderId, status }, { rejectWithValue }) => {
  try {
    const response = await api.patch(`/orders/${orderId}`, { status });
    return response.data;
  } catch (err: any) {
    const message =
      err.response?.data?.message || "Cập nhật đơn hàng thất bại.";
    return rejectWithValue(message);
  }
});

// Delete order
export const deleteOrder = createAsyncThunk<
  string,
  string,
  { rejectValue: string }
>("order/delete", async (orderId, { rejectWithValue }) => {
  try {
    await api.delete(`/orders/${orderId}`);
    return orderId;
  } catch (err: any) {
    const message =
      err.response?.data?.message || "Xóa đơn hàng thất bại.";
    return rejectWithValue(message);
  }
});

const orderSlice = createSlice({
  name: "order",
  initialState,
  reducers: {
    clearOrderError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch All Orders
      .addCase(fetchOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.orders = action.payload;
      })
      .addCase(fetchOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as string) ?? "Fetch failed";
      })
      // Fetch Order By ID
      .addCase(fetchOrderById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchOrderById.fulfilled, (state, action) => {
        state.loading = false;
        const existingIndex = state.orders.findIndex(
          (order) => order.id === action.payload.id
        );
        if (existingIndex >= 0) {
          state.orders[existingIndex] = action.payload;
        } else {
          state.orders.push(action.payload);
        }
      })
      .addCase(fetchOrderById.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as string) ?? "Fetch failed";
      })
      // Create Order
      .addCase(createOrder.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        state.loading = false;
        state.orders.push(action.payload);
      })
      .addCase(createOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as string) ?? "Create failed";
      })
      // Update Order Status
      .addCase(updateOrderStatus.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateOrderStatus.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.orders.findIndex(
          (order) => order.id === action.payload.id
        );
        if (index >= 0) {
          state.orders[index] = action.payload;
        }
      })
      .addCase(updateOrderStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as string) ?? "Update failed";
      })
      // Delete Order
      .addCase(deleteOrder.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteOrder.fulfilled, (state, action) => {
        state.loading = false;
        state.orders = state.orders.filter(
          (order) => order.id !== action.payload
        );
      })
      .addCase(deleteOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as string) ?? "Delete failed";
      });
  },
});

export const { clearOrderError } = orderSlice.actions;
export default orderSlice.reducer;
