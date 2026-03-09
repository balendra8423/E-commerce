import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

// Access the environment variable for your backend URL
const BASE_URL = import.meta.env.VITE_URL;

const initialState = {
  isLoading: false,
  productList: [],
  productDetails: null,
  error: null, // Added for error handling
};

export const fetchAllFilteredProducts = createAsyncThunk(
  "/products/fetchAllFilteredProducts", // Consider a more descriptive name for the thunk itself
  async ({ filterParams, sortParams }, { rejectWithValue }) => {
    try {
      const query = new URLSearchParams({
        ...filterParams,
        sortBy: sortParams,
      });

      const result = await axios.get(
        `${BASE_URL}/api/shop/products/get?${query}` // Use BASE_URL
      );

      // console.log(result); // Keep for debugging if needed, but remove in production
      return result?.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const fetchProductDetails = createAsyncThunk(
  "/products/fetchProductDetails",
  async (id, { rejectWithValue }) => {
    try {
      const result = await axios.get(
        `${BASE_URL}/api/shop/products/get/${id}` // Use BASE_URL
      );
      return result?.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

const shoppingProductSlice = createSlice({
  name: "shoppingProducts",
  initialState,
  reducers: {
    setProductDetails: (state) => {
      state.productDetails = null;
      state.error = null; // Clear error when product details are reset
    },
    clearProductError: (state) => {
      // New reducer to clear error
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // fetchAllFilteredProducts
      .addCase(fetchAllFilteredProducts.pending, (state) => {
        state.isLoading = true;
        state.error = null; // Clear previous errors
      })
      .addCase(fetchAllFilteredProducts.fulfilled, (state, action) => {
        state.isLoading = false;
        state.productList = action.payload.data;
        state.error = null;
      })
      .addCase(fetchAllFilteredProducts.rejected, (state, action) => {
        state.isLoading = false;
        state.productList = []; // Clear product list on failure
        state.error = action.payload || "Failed to fetch products."; // Set error
      })

      // fetchProductDetails
      .addCase(fetchProductDetails.pending, (state) => {
        state.isLoading = true;
        state.error = null; // Clear previous errors
      })
      .addCase(fetchProductDetails.fulfilled, (state, action) => {
        state.isLoading = false;
        state.productDetails = action.payload.data;
        state.error = null;
      })
      .addCase(fetchProductDetails.rejected, (state, action) => {
        state.isLoading = false;
        state.productDetails = null;
        state.error = action.payload || "Failed to fetch product details."; // Set error
      });
  },
});

export const { setProductDetails, clearProductError } =
  shoppingProductSlice.actions; // Export new action

export default shoppingProductSlice.reducer;
