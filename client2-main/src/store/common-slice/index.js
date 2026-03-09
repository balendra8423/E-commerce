import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

// Access the environment variable for your backend URL
const BASE_URL = import.meta.env.VITE_URL;

const initialState = {
  isLoading: false,
  featureImageList: [],
  error: null, // Added for error handling
};

// Existing Thunk for getting feature images
export const getFeatureImages = createAsyncThunk(
  "/common/getFeatureImages",
  async (_, { rejectWithValue }) => {
    // Added rejectWithValue
    try {
      const response = await axios.get(
        `${BASE_URL}/api/common/feature/get` // Use BASE_URL
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Existing Thunk for adding feature image
export const addFeatureImage = createAsyncThunk(
  "/common/addFeatureImage",
  async (image, { rejectWithValue }) => {
    // Added rejectWithValue
    try {
      const response = await axios.post(
        `${BASE_URL}/api/common/feature/add`, // Use BASE_URL
        { image },
        {
          headers: {
            "Content-Type": "application/json", // Explicitly setting Content-Type
          },
        }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// THUNK FOR DELETING FEATURE IMAGE
export const deleteFeatureImage = createAsyncThunk(
  "/common/deleteFeatureImage",
  async (imageId, { rejectWithValue }) => {
    try {
      const response = await axios.delete(
        `${BASE_URL}/api/common/feature/delete/${imageId}` // Use BASE_URL
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

const commonSlice = createSlice({
  name: "commonSlice",
  initialState,
  reducers: {
    // Optional: Add a reducer to clear common errors manually if needed
    clearCommonError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Reducers for getFeatureImages
      .addCase(getFeatureImages.pending, (state) => {
        state.isLoading = true;
        state.error = null; // Clear previous errors
      })
      .addCase(getFeatureImages.fulfilled, (state, action) => {
        state.isLoading = false;
        state.featureImageList = action.payload.data;
        state.error = null;
      })
      .addCase(getFeatureImages.rejected, (state, action) => {
        state.isLoading = false;
        state.featureImageList = []; // Clear list on rejection
        state.error = action.payload || "Failed to fetch feature images.";
      })

      // Reducers for addFeatureImage
      .addCase(addFeatureImage.pending, (state) => {
        state.isLoading = true; // Show loading for add operation
        state.error = null;
      })
      .addCase(addFeatureImage.fulfilled, (state, action) => {
        state.isLoading = false;
        // If your backend returns the newly added image data and you want to update the list immediately:
        // state.featureImageList.push(action.payload.data);
        state.error = null;
      })
      .addCase(addFeatureImage.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || "Failed to add feature image.";
      })

      // Reducers for deleteFeatureImage
      .addCase(deleteFeatureImage.pending, (state) => {
        state.isLoading = true; // Show loading for delete operation
        state.error = null;
      })
      .addCase(deleteFeatureImage.fulfilled, (state, action) => {
        state.isLoading = false;
        // Option 1: Optimistic update - remove the item from the list directly
        // This is if you're sure the backend deletion was successful.
        // Assumes action.meta.arg contains the imageId that was passed to the thunk.
        // state.featureImageList = state.featureImageList.filter(
        //   (image) => image._id !== action.meta.arg
        // );
        // Option 2 (Current behavior): Let `getFeatureImages` be dispatched again after deletion
        // to re-fetch the updated list from the backend, ensuring data consistency.
        state.error = null;
      })
      .addCase(deleteFeatureImage.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || "Failed to delete feature image.";
      });
  },
});

export const { clearCommonError } = commonSlice.actions; // Export any new actions
export default commonSlice.reducer;
