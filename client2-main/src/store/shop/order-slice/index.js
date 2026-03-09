import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

// Access the environment variable for your backend URL
const BASE_URL = import.meta.env.VITE_URL;

const initialState = {
  approvalURL: null,
  isLoading: false,
  orderId: null,
  orderList: [],
  orderDetails: null,
  paymentSuccess: false,
  paymentError: null, // This will store more detailed error from backend
  error: null, // Generic error state for other thunks
};

export const createNewOrder = createAsyncThunk(
  "/order/createNewOrder",
  async (orderData, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${BASE_URL}/api/shop/order/create`, // Use BASE_URL
        orderData,
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

export const capturePayment = createAsyncThunk(
  "/order/capturePayment",
  async (
    { razorpay_order_id, razorpay_payment_id, razorpay_signature, orderId },
    { rejectWithValue } // Added rejectWithValue
  ) => {
    try {
      const response = await axios.post(
        `${BASE_URL}/api/shop/order/capture`, // Use BASE_URL
        {
          razorpay_order_id,
          razorpay_payment_id,
          razorpay_signature,
          orderId,
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

export const getAllOrdersByUserId = createAsyncThunk(
  "/order/getAllOrdersByUserId",
  async (userId, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `${BASE_URL}/api/shop/order/list/${userId}` // Use BASE_URL
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const getOrderDetails = createAsyncThunk(
  "/order/getOrderDetails",
  async (id, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `${BASE_URL}/api/shop/order/details/${id}` // Use BASE_URL
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

const shoppingOrderSlice = createSlice({
  name: "shoppingOrderSlice",
  initialState,
  reducers: {
    resetOrderDetails: (state) => {
      state.orderDetails = null;
      state.error = null; // Also clear generic error
    },
    resetPaymentStatus: (state) => {
      state.paymentSuccess = false;
      state.paymentError = null;
      state.error = null; // Also clear generic error
    },
    clearOrderError: (state) => {
      // New reducer to clear generic error
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Create New Order
      .addCase(createNewOrder.pending, (state) => {
        state.isLoading = true;
        state.error = null; // Clear previous errors
        state.paymentSuccess = false; // Reset payment status
        state.paymentError = null;
      })
      .addCase(createNewOrder.fulfilled, (state, action) => {
        state.isLoading = false;
        state.orderId = action.payload.order._id;
        state.approvalURL = null; // Razorpay doesn't need approval URL like PayPal
        sessionStorage.setItem("currentOrderId", action.payload.order._id);
        state.error = null;
      })
      .addCase(createNewOrder.rejected, (state, action) => {
        state.isLoading = false;
        state.approvalURL = null;
        state.orderId = null;
        state.error = action.payload || "Failed to create order."; // Set general error
      })

      // Capture Payment
      .addCase(capturePayment.pending, (state) => {
        state.isLoading = true;
        state.paymentSuccess = false;
        state.paymentError = null; // Clear specific payment error
        state.error = null; // Clear general error
      })
      .addCase(capturePayment.fulfilled, (state, action) => {
        state.isLoading = false;
        state.paymentSuccess = true;
        state.orderDetails = action.payload.data;
        state.paymentError = null; // Ensure specific payment error is clear
        state.error = null; // Ensure general error is clear
      })
      .addCase(capturePayment.rejected, (state, action) => {
        state.isLoading = false;
        state.paymentSuccess = false;
        // Use action.payload for detailed error from rejectWithValue
        state.paymentError = action.payload || "Payment capture failed.";
        state.error = action.payload || "Payment capture failed."; // Also set general error
      })

      // Get All Orders By User Id
      .addCase(getAllOrdersByUserId.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getAllOrdersByUserId.fulfilled, (state, action) => {
        state.isLoading = false;
        state.orderList = action.payload.data;
        state.error = null;
      })
      .addCase(getAllOrdersByUserId.rejected, (state, action) => {
        state.isLoading = false;
        state.orderList = [];
        state.error = action.payload || "Failed to fetch orders.";
      })

      // Get Order Details
      .addCase(getOrderDetails.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getOrderDetails.fulfilled, (state, action) => {
        state.isLoading = false;
        state.orderDetails = action.payload.data;
        state.error = null;
      })
      .addCase(getOrderDetails.rejected, (state, action) => {
        state.isLoading = false;
        state.orderDetails = null;
        state.error = action.payload || "Failed to fetch order details.";
      });
  },
});

export const { resetOrderDetails, resetPaymentStatus, clearOrderError } =
  shoppingOrderSlice.actions;
export default shoppingOrderSlice.reducer;
