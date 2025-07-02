import {
  addBike,
  createRental,
  deleteBike,
  editBike,
  getAllBikes,
  getAllRentals,
} from "@/services/adminService";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

export const fetchAllBikes = createAsyncThunk(
  "bike/fetchAllBikes",
  async (_, { rejectWithValue }) => {
    try {
      const response = await getAllBikes();

      if (!response.success) {
        throw new Error("Failed to fetch all bikes");
      }

      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const createBike = createAsyncThunk(
  "bike/createBike",
  async (data: any, { rejectWithValue }) => {
    try {
      const response = await addBike(data);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const updateBike = createAsyncThunk(
  "bike/updateBike",
  async (data: any, { rejectWithValue }) => {
    try {
      console.log(data, "data");
      const response = await editBike(data?.bikeId, data?.bikeData);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const removeBike = createAsyncThunk(
  "bike/removeBike",
  async (bikeId: string, { rejectWithValue }) => {
    try {
      const response = await deleteBike(bikeId);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const getRentals = createAsyncThunk(
  "rental/getRentals",
  async (_, { rejectWithValue }) => {
    try {
      const response = await getAllRentals();
      return response;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const addRental = createAsyncThunk(
  "rental/addRental",
  async (data: any, { rejectWithValue }) => {
    try {
      const response = await createRental(data);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

const adminSlice = createSlice({
  name: "admin",
  initialState: {
    bikes: [] as any,
    bike: {} as any,
    rentals: [] as any,
    rental: {} as any,
    loading: false,
    error: null as any,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllBikes.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllBikes.fulfilled, (state, action) => {
        state.loading = false;
        state.bikes = action.payload;
      })
      .addCase(fetchAllBikes.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(createBike.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createBike.fulfilled, (state, action) => {
        state.loading = false;
        state.bikes.push(action.payload);
      })
      .addCase(createBike.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(updateBike.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateBike.fulfilled, (state, action) => {
        state.loading = false;
        state.bike = action.payload;
      })
      .addCase(updateBike.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(removeBike.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(removeBike.fulfilled, (state, action) => {
        state.loading = false;
        state.bikes = state.bikes.filter(
          (bike: any) => bike.bikeId !== action.payload.bikeId
        );
      })
      .addCase(removeBike.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(getRentals.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getRentals.fulfilled, (state, action) => {
        state.loading = false;
        state.rentals = action.payload;
      })
      .addCase(getRentals.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(addRental.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addRental.fulfilled, (state, action) => {
        state.loading = false;
        state.rentals.push(action.payload);
      })
      .addCase(addRental.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default adminSlice.reducer;
