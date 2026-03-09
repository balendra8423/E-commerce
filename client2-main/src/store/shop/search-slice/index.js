import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

// Access the environment variable for your backend URL
const BASE_URL = import.meta.env.VITE_URL;

const initialState = {
  isLoading: false,
  searchResults: [],
  error: null, // Added for error handling
};

export const getSearchResults = createAsyncThunk(
  "/shop/getSearchResults", // Changed thunk action type to reflect shop context
  async (keyword, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `${BASE_URL}/api/shop/search/${keyword}` // Use BASE_URL
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

const searchSlice = createSlice({
  name: "searchSlice",
  initialState,
  reducers: {
    resetSearchResults: (state) => {
      state.searchResults = [];
      state.error = null; // Clear error when search results are reset
      state.isLoading = false; // Ensure loading is false when results are reset
    },
    clearSearchError: (state) => {
      // New reducer to clear search-specific error
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getSearchResults.pending, (state) => {
        state.isLoading = true;
        state.error = null; // Clear previous errors
      })
      .addCase(getSearchResults.fulfilled, (state, action) => {
        state.isLoading = false;
        state.searchResults = action.payload.data;
        state.error = null;
      })
      .addCase(getSearchResults.rejected, (state, action) => {
        state.isLoading = false;
        state.searchResults = []; // Clear search results on failure
        state.error = action.payload || "Failed to fetch search results."; // Set error
      });
  },
});

export const { resetSearchResults, clearSearchError } = searchSlice.actions; // Export new action

export default searchSlice.reducer;
