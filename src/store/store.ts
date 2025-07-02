import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./reducers/authSlice";
import userReducer from "./reducers/userSlice";
import rentalReducer from "./reducers/rentalSlice";
import bikeReducer from "./reducers/bikeSlice";
import paymentReducer from "./reducers/paymentSlice";
import adminReducer from "./reducers/adminSlice";

export const store = configureStore({
  reducer: {
    admin: adminReducer,
    auth: authReducer,
    user: userReducer,
    rental: rentalReducer,
    bike: bikeReducer,
    payment: paymentReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
