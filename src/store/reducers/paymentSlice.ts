import { createOrder, verifyPayment } from "@/services/paymentService";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

const initialState: any = {
  orderData: {},
  message: "",
  loading: false,
  error: null,
};

export const createOrderRequest = createAsyncThunk(
  "payment/createOrderRequest",
  async (data: { rentalId: string; amount: number }, { rejectWithValue }) => {
    try {
      const response = await createOrder(data);
      if (!response.success) {
        throw new Error(response.message);
      }
      return response;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const verifyPaymentRequest = createAsyncThunk(
  "payment/verifyPaymentRequest",
  async (
    data: { paymentId: string; orderId: string; signature: string },
    { rejectWithValue }
  ) => {
    try {
      const response = await verifyPayment(data);
      if (!response.success) {
        throw new Error(response.message);
      }
      return response;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

const paymentSlice = createSlice({
  name: "payment",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(createOrderRequest.fulfilled, (state, action) => {
        state.loading = false;
        state.orderData = action.payload.order;
      })
      .addCase(createOrderRequest.rejected, (state, action) => {
        state.loading = true;
        state.error = action.payload;
      })
      .addCase(createOrderRequest.pending, (state, action) => {
        state.loading = false;
        state.error = null;
      })
      .addCase(verifyPaymentRequest.fulfilled, (state, action) => {
        state.loading = false;
        state.message = action.payload.message;
      })
      .addCase(verifyPaymentRequest.rejected, (state, action) => {
        state.loading = true;
        state.error = action.payload;
      })
      .addCase(verifyPaymentRequest.pending, (state, action) => {
        state.loading = false;
        state.error = null;
      });
  },
});

export default paymentSlice.reducer;
