import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

// Access the environment variable for your backend URL
const BASE_URL = import.meta.env.VITE_URL;

const initialState = {
  isAuthenticated: false,
  isLoading: true, // Renamed from initial 'isLoading' for clarity
  user: null,
  error: null, // Added for error handling
};

export const registerUser = createAsyncThunk(
  "/auth/register",
  async (formData, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${BASE_URL}/api/auth/register`, // Use BASE_URL
        formData,
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json", // Explicitly setting Content-Type for POST
          },
        }
      );
      return response.data;
    } catch (error) {
      // Use rejectWithValue to pass the error data to the rejected action
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const loginUser = createAsyncThunk(
  "/auth/login",
  async (formData, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${BASE_URL}/api/auth/login`, // Use BASE_URL
        formData,
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json", // Explicitly setting Content-Type for POST
          },
        }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const logoutUser = createAsyncThunk(
  "/auth/logout",
  async (_, { rejectWithValue }) => {
    // Use '_' for unused first arg
    try {
      const response = await axios.post(
        `${BASE_URL}/api/auth/logout`, // Use BASE_URL
        {}, // Empty body for POST logout
        {
          withCredentials: true,
        }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const checkAuth = createAsyncThunk(
  "/auth/checkauth",
  async (_, { rejectWithValue }) => {
    // Use '_' for unused first arg
    try {
      const response = await axios.get(
        `${BASE_URL}/api/auth/check-auth`, // Use BASE_URL
        {
          withCredentials: true,
          headers: {
            "Cache-Control":
              "no-store, no-cache, must-revalidate, proxy-revalidate",
            Pragma: "no-cache", // Added Pragma for older caches
            Expires: "0", // Added Expires for older caches
          },
        }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    // You might want to remove this if not explicitly used,
    // as user state is handled by async thunks.
    // If you need to manually set the user from local storage or elsewhere, keep it.
    setUser: (state, action) => {
      state.user = action.payload;
      state.isAuthenticated = !!action.payload; // Set isAuthenticated based on user presence
      state.isLoading = false; // Assuming setting user manually means loading is complete
    },
    // Add a reducer to clear auth errors manually if needed (e.g., when closing an error alert)
    clearAuthError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Register User
      .addCase(registerUser.pending, (state) => {
        state.isLoading = true;
        state.error = null; // Clear previous errors
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.isLoading = false;
        // Assuming your backend sends 'success: true' and a message on successful registration
        // but typically registration doesn't immediately log in the user or return user data for frontend
        // If it does, uncomment and adjust the following lines:
        // state.user = action.payload.success ? action.payload.user : null;
        // state.isAuthenticated = action.payload.success;
        state.user = null; // User is not logged in after just registering
        state.isAuthenticated = false;
        state.error = null;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.isLoading = false;
        state.user = null;
        state.isAuthenticated = false;
        state.error = action.payload || "Registration failed."; // Set error message
      })

      // Login User
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        console.log("Login Fulfilled Action:", action.payload); // For debugging

        state.isLoading = false;
        state.user = action.payload.success ? action.payload.user : null;
        state.isAuthenticated = action.payload.success;
        state.error = null;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.user = null;
        state.isAuthenticated = false;
        state.error =
          action.payload || "Login failed. Please check your credentials."; // Set error message
      })

      // Check Auth (Initial load or route protection)
      .addCase(checkAuth.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(checkAuth.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.success ? action.payload.user : null;
        state.isAuthenticated = action.payload.success;
        state.error = null;
      })
      .addCase(checkAuth.rejected, (state, action) => {
        state.isLoading = false;
        state.user = null;
        state.isAuthenticated = false;
        state.error = action.payload || "Authentication check failed."; // Set error message
      })

      // Logout User
      .addCase(logoutUser.pending, (state) => {
        state.isLoading = true; // Still show loading while logging out
        state.error = null;
      })
      .addCase(logoutUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = null;
        state.isAuthenticated = false;
        state.error = null;
      })
      .addCase(logoutUser.rejected, (state, action) => {
        state.isLoading = false;
        // Even if logout fails (e.g., network error), usually you'd still want to clear auth state
        state.user = null;
        state.isAuthenticated = false;
        state.error =
          action.payload || "Logout failed, but user state cleared."; // Provide an error message
      });
  },
});

export const { setUser, clearAuthError } = authSlice.actions; // Export clearAuthError
export default authSlice.reducer;
