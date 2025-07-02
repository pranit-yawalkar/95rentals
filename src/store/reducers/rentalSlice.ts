import { bookRental, getAllRentals } from "@/services/rentalService";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

const initialState: any = {
  rental: {},
  rentals: [],
  loading: false,
  error: null,
};

export const bookRentalRequest = createAsyncThunk(
  "rental/uploadUserDocs",
  async (
    data: {
      bikeId: string;
      startTime: string;
      endTime: string;
      totalAmount: number;
    },
    { rejectWithValue }
  ) => {
    try {
      const response = await bookRental(data);
      if (!response.success) {
        throw new Error(response.message);
      }
      return response;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const getRentals = createAsyncThunk(
  "rental/getAllRentals",
  async (_, { rejectWithValue }) => {
    try {
      const response = await getAllRentals();
      if (!response.success) {
        throw new Error(response.message);
      }
      return response;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

const rentalSlice = createSlice({
  name: "rental",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(bookRentalRequest.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
      })
      .addCase(bookRentalRequest.rejected, (state, action) => {
        state.loading = true;
        state.error = action.payload;
      })
      .addCase(bookRentalRequest.pending, (state, action) => {
        state.loading = false;
        state.error = null;
      })
      .addCase(getRentals.fulfilled, (state, action) => {
        state.loading = false;
        state.rentals = action.payload.rentals;
      })
      .addCase(getRentals.rejected, (state, action) => {
        state.loading = true;
        state.error = action.payload;
      })
      .addCase(getRentals.pending, (state, action) => {
        state.loading = false;
        state.error = null;
      });
  },
});

export default rentalSlice.reducer;
