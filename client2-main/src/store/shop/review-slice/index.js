import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Access the environment variable for your backend URL
const BASE_URL = import.meta.env.VITE_URL;

const initialState = {
  isLoading: false,
  reviews: [],
  error: null, // Added for error handling
};

export const addReview = createAsyncThunk(
  "/shop/addReview", // Adjusted path to be more specific if it's a shop-related review
  async (formdata, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${BASE_URL}/api/shop/review/add`, // Use BASE_URL
        formdata,
        {
          headers: {
            "Content-Type": "application/json", // Good practice for POST requests
          },
        }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const getReviews = createAsyncThunk(
  "/shop/getReviews", // Adjusted path to be more specific
  async (id, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `${BASE_URL}/api/shop/review/${id}` // Use BASE_URL
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

const reviewSlice = createSlice({
  name: "reviewSlice",
  initialState,
  reducers: {
    // Optional: Add a reducer to clear review errors manually
    clearReviewError: (state) => {
      state.error = null;
    },
    // Optional: Reset reviews list
    resetReviews: (state) => {
      state.reviews = [];
      state.isLoading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // addReview
      .addCase(addReview.pending, (state) => {
        state.isLoading = true;
        state.error = null; // Clear previous errors
      })
      .addCase(addReview.fulfilled, (state, action) => {
        state.isLoading = false;
        state.error = null;
        // Optionally update the reviews list if your backend returns the new review
        // or the updated list of reviews. If not, you might want to re-fetch reviews
        // after adding one.
        // For example: state.reviews.push(action.payload.data);
      })
      .addCase(addReview.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || "Failed to add review."; // Set error message
      })

      // getReviews
      .addCase(getReviews.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getReviews.fulfilled, (state, action) => {
        state.isLoading = false;
        state.reviews = action.payload.data;
        state.error = null;
      })
      .addCase(getReviews.rejected, (state, action) => {
        state.isLoading = false;
        state.reviews = []; // Clear reviews on fetch failure
        state.error = action.payload || "Failed to fetch reviews."; // Set error message
      });
  },
});

export const { clearReviewError, resetReviews } = reviewSlice.actions; // Export new actions
export default reviewSlice.reducer;
