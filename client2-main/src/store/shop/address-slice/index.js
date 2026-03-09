import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Access the environment variable for your backend URL
const BASE_URL = import.meta.env.VITE_URL;

const initialState = {
  isLoading: false,
  addressList: [],
  error: null, // Added for error handling
};

export const addNewAddress = createAsyncThunk(
  "/addresses/addNewAddress",
  async (formData, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${BASE_URL}/api/shop/address/add`, // Use BASE_URL
        formData,
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

export const fetchAllAddresses = createAsyncThunk(
  "/addresses/fetchAllAddresses",
  async (userId, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `${BASE_URL}/api/shop/address/get/${userId}` // Use BASE_URL
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const editaAddress = createAsyncThunk(
  "/addresses/editaAddress",
  async ({ userId, addressId, formData }, { rejectWithValue }) => {
    try {
      const response = await axios.put(
        `${BASE_URL}/api/shop/address/update/${userId}/${addressId}`, // Use BASE_URL
        formData,
        {
          headers: {
            "Content-Type": "application/json", // Good practice for PUT requests
          },
        }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const deleteAddress = createAsyncThunk(
  "/addresses/deleteAddress",
  async ({ userId, addressId }, { rejectWithValue }) => {
    try {
      const response = await axios.delete(
        `${BASE_URL}/api/shop/address/delete/${userId}/${addressId}` // Use BASE_URL
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

const addressSlice = createSlice({
  name: "address",
  initialState,
  reducers: {
    // Optional: Add a reducer to clear address errors manually
    clearAddressError: (state) => {
      state.error = null;
    },
    // Optional: Add a reducer to manually set addresses if needed
    setAddressList: (state, action) => {
      state.addressList = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // addNewAddress
      .addCase(addNewAddress.pending, (state) => {
        state.isLoading = true;
        state.error = null; // Clear previous errors
      })
      .addCase(addNewAddress.fulfilled, (state, action) => {
        state.isLoading = false;
        state.error = null;
        // Optionally update addressList if API returns the new address
        // state.addressList.push(action.payload.data);
      })
      .addCase(addNewAddress.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || "Failed to add new address.";
      })

      // fetchAllAddresses
      .addCase(fetchAllAddresses.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchAllAddresses.fulfilled, (state, action) => {
        state.isLoading = false;
        state.addressList = action.payload.data;
        state.error = null;
      })
      .addCase(fetchAllAddresses.rejected, (state, action) => {
        state.isLoading = false;
        state.addressList = []; // Clear list on rejection
        state.error = action.payload || "Failed to fetch addresses.";
      })

      // editaAddress
      .addCase(editaAddress.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(editaAddress.fulfilled, (state, action) => {
        state.isLoading = false;
        state.error = null;
        // Optionally update the edited address in addressList
        // const updatedAddress = action.payload.data;
        // state.addressList = state.addressList.map(address =>
        //   address._id === updatedAddress._id ? updatedAddress : address
        // );
      })
      .addCase(editaAddress.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || "Failed to edit address.";
      })

      // deleteAddress
      .addCase(deleteAddress.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(deleteAddress.fulfilled, (state, action) => {
        state.isLoading = false;
        state.error = null;
        // Optionally remove the deleted address from addressList
        // const deletedAddressId = action.meta.arg.addressId; // assuming arg matches { userId, addressId }
        // state.addressList = state.addressList.filter(address => address._id !== deletedAddressId);
      })
      .addCase(deleteAddress.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || "Failed to delete address.";
      });
  },
});

export const { clearAddressError, setAddressList } = addressSlice.actions; // Export new actions
export default addressSlice.reducer;
