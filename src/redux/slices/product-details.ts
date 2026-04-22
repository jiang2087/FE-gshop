import { createSlice } from "@reduxjs/toolkit";

const initialState: any = {
  value: null,
};

export const productDetails = createSlice({
  name: "productDetails",
  initialState,
  reducers: {
    updateproductDetails: (_, action) => {
      return {
        value: action.payload,
      };
    },
    clearProductDetails: () => {
      return {
        value: null,
      };
    },
  },
});

export const { updateproductDetails, clearProductDetails } = productDetails.actions;
export default productDetails.reducer;
