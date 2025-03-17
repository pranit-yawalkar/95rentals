import { configureStore } from '@reduxjs/toolkit';
import rentalReducer from './reducers/rentalSlice';
import bikeReducer from './reducers/bikeSlice';

export const store = configureStore({
  reducer: {
    rental: rentalReducer,
    bike: bikeReducer
  }
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
