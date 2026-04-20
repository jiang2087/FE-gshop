import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { getWishlist, addWishlist, deleteWishlist } from "../../api/productApi";
import { RootState } from "../store";

export type WishListItem = {
  productId: number;
  userId: number;
  thumbnail: string;
  price: number;
  name: string;
  inStock: boolean;
};

type InitialState = {
  items: WishListItem[];
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
};

const initialState: InitialState = {
  items: [],
  status: "idle",
  error: null,
};

export const fetchWishlistThunk = createAsyncThunk<
  WishListItem[],
  void,
  { state: RootState; rejectValue: string }
>("wishlist/fetchWishlist", async (_, { getState, rejectWithValue }) => {
  try {
    const userId = getState().auth.user?.id;
    if (!userId) {
      return rejectWithValue("Người dùng chưa đăng nhập");
    }
    const data = await getWishlist(userId);
    return data;
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message || "Lỗi tải wishlist");
  }
});

export const addItemToWishlist = createAsyncThunk<
  WishListItem,
  number,
  { state: RootState; rejectValue: string }
>("wishlist/addItem", async (productId, { getState, rejectWithValue }) => {
  try {
    const userId = getState().auth.user?.id;
    if (!userId) {
      return rejectWithValue("Người dùng chưa đăng nhập");
    }
    const data = await addWishlist(userId, productId);
    return data;
  } catch (error: any) {
    return rejectWithValue(
      error.response?.data?.message || "Lỗi thêm vào wishlist"
    );
  }
});

export const removeItemFromWishlist = createAsyncThunk<
  number,
  number,
  { state: RootState; rejectValue: string }
>("wishlist/removeItem", async (productId, { getState, rejectWithValue }) => {
  try {
    const userId = getState().auth.user?.id;
    if (!userId) {
      return rejectWithValue("Người dùng chưa đăng nhập");
    }
    await deleteWishlist(userId, productId);
    return productId;
  } catch (error: any) {
    return rejectWithValue(
      error.response?.data?.message || "Lỗi xóa khỏi wishlist"
    );
  }
});

export const wishlistSlice = createSlice({
  name: "wishlist",
  initialState,
  reducers: {
    removeAllItemsFromWishlist: (state) => {
      state.items = [];
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Wishlist
      .addCase(fetchWishlistThunk.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(
        fetchWishlistThunk.fulfilled,
        (state, action: PayloadAction<WishListItem[]>) => {
          state.status = "succeeded";
          state.items = action.payload;
        }
      )
      .addCase(fetchWishlistThunk.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload as string;
      })
      // Add Item
      .addCase(
        addItemToWishlist.fulfilled,
        (state, action: PayloadAction<WishListItem>) => {
          // You may want to prevent duplicates or just push
          const exists = state.items.find(
            (item) => item.productId === action.payload.productId
          );
          if (!exists) {
            state.items.push(action.payload);
          }
        }
      )
      // Remove Item
      .addCase(
        removeItemFromWishlist.fulfilled,
        (state, action: PayloadAction<number>) => {
          state.items = state.items.filter(
            (item) => item.productId !== action.payload
          );
        }
      );
  },
});

export const { removeAllItemsFromWishlist } = wishlistSlice.actions;

export default wishlistSlice.reducer;

