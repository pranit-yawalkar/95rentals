import { getAllUsers, getUser, uploadDocs } from "@/services/userService";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

const initialState: any = {
  user: {},
  users: [],
  loading: false,
  error: null,
};

export const uploadUserDocs = createAsyncThunk(
  "user/uploadUserDocs",
  async (data: any, { rejectWithValue }) => {
    try {
      const response = await uploadDocs(data);
      if (!response.success) {
        throw new Error(response.message);
      }
      return response;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const getUserData = createAsyncThunk(
  "user/getUser",
  async (_, { rejectWithValue }) => {
    try {
      const response = await getUser();
      if (!response.success) {
        throw new Error(response.message);
      }
      return response;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const getUsers = createAsyncThunk(
  "user/getUsers",
  async (_, { rejectWithValue }) => {
    try {
      const response = await getAllUsers();
      if (!response.success) {
        throw new Error(response.message);
      }
      return response;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(uploadUserDocs.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
      })
      .addCase(uploadUserDocs.rejected, (state, action) => {
        state.loading = true;
        state.error = action.payload;
      })
      .addCase(uploadUserDocs.pending, (state, action) => {
        state.loading = false;
        state.error = null;
      })
      .addCase(getUserData.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
      })
      .addCase(getUserData.rejected, (state, action) => {
        state.loading = true;
        state.error = action.payload;
      })
      .addCase(getUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.users = action.payload.users;
      })
      .addCase(getUsers.rejected, (state, action) => {
        state.loading = true;
        state.error = action.payload;
      });
  },
});

export default userSlice.reducer;
