import { createSelector, createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../store";
import { getCart, getCartTotal, addToCart, updateCartItem, deleteCartItem, clearCart } from "@/api/cartApi";

type CartItem = {
  cartId: number;
  cartItemId: number;
  productVariantId: number;
  imageUrl: string;
  sku: string;
  hexColor: string;
  nameColor: string;
  price: number;
  quantity: number;
  cartKey: string;
};

type CartState = {
  items: CartItem[];
  cartTotal: number;
  loading: boolean;
  cartNumber: number;
  error: string | null;
};

const initialState: CartState = {
  items: [],
  cartTotal: 0,
  cartNumber: 0,
  loading: false,
  error: null,
};

// Fetch cart
export const fetchCart = createAsyncThunk<
  CartItem[],
  number,
  { rejectValue: string }
>("cart/fetch", async (cartId, { rejectWithValue }) => {
  try {
    const response = await getCart(cartId);
    return response;
  } catch (err: any) {
    const message = err.response?.data?.message || "Không thể tải giỏ hàng.";
    return rejectWithValue(message);
  }
});

// Add to cart
export const addToCartThunk = createAsyncThunk<
  CartItem,
  { cartKey: string; productVariantId: number; quantity: number },
  { rejectValue: string }
>("cart/add", async ({ cartKey, productVariantId, quantity }, { rejectWithValue }) => {
  try {
    const response = await addToCart(cartKey, productVariantId, quantity);
    return response;
  } catch (err: any) {
    const message = err.response?.data?.message || "Thêm vào giỏ hàng thất bại.";
    return rejectWithValue(message);
  }
});

// Fetch cart total
export const fetchCartTotal = createAsyncThunk<
  number,
  number,
  { rejectValue: string }
>("cart/total", async (cartId, { rejectWithValue }) => {
  try {
    const response = await getCartTotal(cartId);
    return response;
  } catch (err: any) {
    const message = err.response?.data?.message || "Không thể tải tổng giỏ hàng.";
    return rejectWithValue(message);
  }
});

// Update cart item
export const updateCartItemThunk = createAsyncThunk<
  { cartItemId: number; quantity: number },
  { cartItemId: number; quantity: number },
  { rejectValue: string }
>("cart/update", async ({ cartItemId, quantity }, { rejectWithValue }) => {
  try {
    await updateCartItem(cartItemId, quantity);
    return { cartItemId, quantity };
  } catch (err: any) {
    const message = err.response?.data?.message || "Cập nhật giỏ hàng thất bại.";
    return rejectWithValue(message);
  }
});

// Delete cart item
export const deleteCartItemThunk = createAsyncThunk<
  number,
  number,
  { rejectValue: string }
>("cart/delete", async (cartItemId, { rejectWithValue }) => {
  try {
    await deleteCartItem(cartItemId);
    return cartItemId;
  } catch (err: any) {
    const message = err.response?.data?.message || "Xóa item thất bại.";
    return rejectWithValue(message);
  }
});

// Clear cart
export const clearCartThunk = createAsyncThunk<
  void,
  number,
  { rejectValue: string }
>("cart/clear", async (cartId, { rejectWithValue }) => {
  try {
    await clearCart(cartId);
  } catch (err: any) {
    const message = err.response?.data?.message || "Xóa giỏ hàng thất bại.";
    return rejectWithValue(message);
  }
});

// Utility to recalculate total quantity
const recalculateCartNumber = (items: CartItem[]) => {
  return items.reduce((sum, item) => sum + item.quantity, 0);
};

export const cart = createSlice({
  name: "cart",
  initialState,
  reducers: {
    clearCartError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch
      .addCase(fetchCart.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCart.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
        state.cartNumber = recalculateCartNumber(state.items);
      })
      .addCase(fetchCart.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as string) ?? "Fetch failed";
      })
      // Add
      .addCase(addToCartThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addToCartThunk.fulfilled, (state, action) => {
        state.loading = false;
        const existingItem = state.items.find((item) => item.productVariantId === action.payload.productVariantId);
        if (existingItem) {
          existingItem.quantity += action.payload.quantity;
        } else {
          state.items.push(action.payload);
        }
        state.cartTotal += action.payload.price * action.payload.quantity;
        state.cartNumber = recalculateCartNumber(state.items);
      })
      .addCase(addToCartThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as string) ?? "Add failed";
      })
      // Fetch Total
      .addCase(fetchCartTotal.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCartTotal.fulfilled, (state, action) => {
        state.loading = false;
        state.cartTotal = action.payload;
      })
      .addCase(fetchCartTotal.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as string) ?? "Fetch total failed";
      })
      // Update
      .addCase(updateCartItemThunk.pending, (state) => {
        state.loading = true;
        state.error = null;

      })
      .addCase(updateCartItemThunk.fulfilled, (state, action) => {
        state.loading = false;
        const item = state.items.find((item) => item.cartItemId === action.payload.cartItemId);
        if (item) {
          state.cartTotal = state.cartTotal - item.price * (item.quantity - action.payload.quantity);
          item.quantity = action.payload.quantity;
        }
        state.cartNumber = recalculateCartNumber(state.items);
      })
      .addCase(updateCartItemThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as string) ?? "Update failed";
      })
      // Delete
      .addCase(deleteCartItemThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteCartItemThunk.fulfilled, (state, action) => {
        state.loading = false;

        const deletedItem = state.items.find(
          (item) => item.cartItemId === action.payload
        );

        if (deletedItem) {
          state.cartTotal -= deletedItem.price * deletedItem.quantity;
        }

        state.items = state.items.filter(
          (item) => item.cartItemId !== action.payload
        );
        state.cartNumber = recalculateCartNumber(state.items);
      })
      .addCase(deleteCartItemThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as string) ?? "Delete failed";
      })
      // Clear
      .addCase(clearCartThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(clearCartThunk.fulfilled, (state) => {
        state.loading = false;
        state.items = [];
        state.cartTotal = 0;
        state.cartNumber = 0;
      })
      .addCase(clearCartThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as string) ?? "Clear failed";
      });
  },
});

export const selectCartItems = (state: RootState) => state.cartReducer.items;
export const selectCartTotal = (state: RootState) => state.cartReducer.cartTotal;
export const selectCartNumber = (state: RootState) => state.cartReducer.cartNumber;

export const { clearCartError } = cart.actions;
export default cart.reducer;
