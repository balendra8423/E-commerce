import axios from "axios";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// Access the environment variable for your backend URL
const BASE_URL = import.meta.env.VITE_URL;

const initialState = {
  cartItems: [],
  isLoading: false,
  error: null, // Added for error handling
};

export const addToCart = createAsyncThunk(
  "cart/addToCart",
  async ({ userId, productId, quantity }, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${BASE_URL}/api/shop/cart/add`, // Use BASE_URL
        {
          userId,
          productId,
          quantity,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const fetchCartItems = createAsyncThunk(
  "cart/fetchCartItems",
  async (userId, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `${BASE_URL}/api/shop/cart/get/${userId}` // Use BASE_URL
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const deleteCartItem = createAsyncThunk(
  "cart/deleteCartItem",
  async ({ userId, productId }, { rejectWithValue }) => {
    try {
      const response = await axios.delete(
        `${BASE_URL}/api/shop/cart/${userId}/${productId}` // Use BASE_URL
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const updateCartQuantity = createAsyncThunk(
  "cart/updateCartQuantity",
  async ({ userId, productId, quantity }, { rejectWithValue }) => {
    try {
      const response = await axios.put(
        `${BASE_URL}/api/shop/cart/update-cart`, // Use BASE_URL
        {
          userId,
          productId,
          quantity,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

const shoppingCartSlice = createSlice({
  name: "shoppingCart",
  initialState,
  reducers: {
    // Optional: Add a reducer to clear cart-related errors manually
    clearCartError: (state) => {
      state.error = null;
    },
    // Optional: Reset cart state (e.g., after checkout)
    resetCart: (state) => {
      state.cartItems = [];
      state.isLoading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // addToCart
      .addCase(addToCart.pending, (state) => {
        state.isLoading = true;
        state.error = null; // Clear previous errors
      })
      .addCase(addToCart.fulfilled, (state, action) => {
        state.isLoading = false;
        state.cartItems = action.payload.data; // Assuming payload.data is the updated cart
        state.error = null;
      })
      .addCase(addToCart.rejected, (state, action) => {
        state.isLoading = false;
        // Keep existing cart items or clear based on desired behavior on failure
        // state.cartItems = []; // Consider if you want to clear on every rejection
        state.error = action.payload || "Failed to add item to cart.";
      })

      // fetchCartItems
      .addCase(fetchCartItems.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchCartItems.fulfilled, (state, action) => {
        state.isLoading = false;
        state.cartItems = action.payload.data;
        state.error = null;
      })
      .addCase(fetchCartItems.rejected, (state, action) => {
        state.isLoading = false;
        state.cartItems = []; // Clear cart on fetch failure
        state.error = action.payload || "Failed to fetch cart items.";
      })

      // updateCartQuantity
      .addCase(updateCartQuantity.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateCartQuantity.fulfilled, (state, action) => {
        state.isLoading = false;
        state.cartItems = action.payload.data; // Assuming payload.data is the updated cart
        state.error = null;
      })
      .addCase(updateCartQuantity.rejected, (state, action) => {
        state.isLoading = false;
        // state.cartItems = []; // Consider if you want to clear on every rejection
        state.error = action.payload || "Failed to update cart quantity.";
      })

      // deleteCartItem
      .addCase(deleteCartItem.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(deleteCartItem.fulfilled, (state, action) => {
        state.isLoading = false;
        state.cartItems = action.payload.data; // Assuming payload.data is the updated cart
        state.error = null;
      })
      .addCase(deleteCartItem.rejected, (state, action) => {
        state.isLoading = false;
        // state.cartItems = []; // Consider if you want to clear on every rejection
        state.error = action.payload || "Failed to delete item from cart.";
      });
  },
});

export const { clearCartError, resetCart } = shoppingCartSlice.actions; // Export new actions
export default shoppingCartSlice.reducer;
