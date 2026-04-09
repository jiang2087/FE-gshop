import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "@/api/axiosInstace";

export type Address = {
  id: number;
  recipientName: string;
  phone: string;
  address: string;
  isDefault?: boolean;
};

type AddressState = {
  addresses: Address[];
  loading: boolean;
  error: string | null;
};

const initialState: AddressState = {
  addresses: [],
  loading: false,
  error: null,
};

// Fetch all addresses
export const getAddressesByUser = createAsyncThunk<
 Address[],
  Number,
  { rejectValue: string }
>("address/fetchAll", async (id, { rejectWithValue }) => {
  try {
    const response = await api.get(`/address/user/${id}`);
    return response.data;
  } catch (err: any) {
    const message =
      err.response?.data?.message || "Không thể tải danh sách địa chỉ.";
    return rejectWithValue(message);
  }
});

export const getAddressesById = createAsyncThunk<
  Address[],
  void,
  { rejectValue: string }
>("address/fetchAll", async (id, { rejectWithValue }) => {
  try {
    const response = await api.get(`/address/user/${id}`);
    return response.data;
  } catch (err: any) {
    const message =
      err.response?.data?.message || "Không thể tải danh sách địa chỉ.";
    return rejectWithValue(message);
  }
});

// Add a new address
export const addAddress = createAsyncThunk<
  Address,
  { addressData: Omit<Address, "id">, userId: number },
  { rejectValue: string }
>("address/add", async ({ addressData, userId }, { rejectWithValue }) => {
  try {
    const response = await api.post(`/address/user/${userId}`, addressData);
    return response.data;
  } catch (err: any) {
    const message =
      err.response?.data?.message || "Thêm địa chỉ thất bại.";
    return rejectWithValue(message);
  }
});

// Update an address
export const updateAddress = createAsyncThunk<
  Address,
  { userId: number; addressData: Address },
  { rejectValue: string }
>("address/update", async ({ userId, addressData }, { rejectWithValue }) => {
  try {
    const response = await api.put(`/address?userId=${userId}&addressId=${addressData.id}`, addressData);
    return response.data;
  } catch (err: any) {
    const message =
      err.response?.data?.message || "Cập nhật địa chỉ thất bại.";
    return rejectWithValue(message);
  }
});

// Delete an address
export const deleteAddress = createAsyncThunk<
  number,
  { addressId: number , userId: number },
  { rejectValue: string }
>("address/delete", async ({ addressId, userId }, { rejectWithValue }) => {
  try {
    await api.delete(`/address?userId=${userId}&addressId=${addressId}`);
    return addressId;
  } catch (err: any) {
    const message =
      err.response?.data?.message || "Xóa địa chỉ thất bại.";
    return rejectWithValue(message);
  }
});

const addressSlice = createSlice({
  name: "address",
  initialState,
  reducers: {
    clearAddressError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch
      .addCase(getAddressesByUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAddressesByUser.fulfilled, (state, action) => {
        state.loading = false;
        state.addresses = action.payload;
      })
      .addCase(getAddressesByUser.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as string) ?? "Fetch failed";
      })
      // Add
      .addCase(addAddress.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addAddress.fulfilled, (state, action) => {
        state.loading = false;
        state.addresses.push(action.payload);
      })
      .addCase(addAddress.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as string) ?? "Add failed";
      })
      // Delete
      .addCase(deleteAddress.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteAddress.fulfilled, (state, action) => {
        state.loading = false;
        state.addresses = state.addresses.filter(
          (addr) => addr.id !== action.payload
        );
      })
      .addCase(deleteAddress.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as string) ?? "Delete failed";
      })
      // Update
      .addCase(updateAddress.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateAddress.fulfilled, (state, action) => {
        state.loading = false;
        state.addresses = state.addresses.map((addr) =>
          addr.id === action.payload.id ? action.payload : addr
        );
      })
      .addCase(updateAddress.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as string) ?? "Update failed";
      });
  },
});

export const { clearAddressError } = addressSlice.actions;
export default addressSlice.reducer;
