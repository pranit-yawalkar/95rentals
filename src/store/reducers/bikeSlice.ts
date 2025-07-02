import { getAvailableBikes } from "@/services/bikeService";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Async Thunk to Fetch Available Bikes
export const fetchAvailableBikes = createAsyncThunk(
  "bike/fetchAvailableBikes",
  async (dateRange: any, { rejectWithValue }) => {
    try {
      const response = await getAvailableBikes(
        dateRange.startTime,
        dateRange.endTime
      );

      if (!response.success) {
        throw new Error("Failed to fetch available bikes");
      }

      return response.bikes;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

const bikeSlice = createSlice({
  name: "bike",
  initialState: {
    availableBikes: [],
    response: null,
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAvailableBikes.pending, (state: any) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAvailableBikes.fulfilled, (state: any, action: any) => {
        console.log("action.payload", action.payload);
        state.loading = false;
        state.availableBikes = Array.isArray(action.payload)
          ? action.payload
          : []; // ✅ Ensure it's an array
      })
      .addCase(fetchAvailableBikes.rejected, (state: any, action: any) => {
        state.loading = false;
        state.error = action.payload;
      })
  },
});

export default bikeSlice.reducer;
