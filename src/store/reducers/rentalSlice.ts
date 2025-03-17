import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface RentalState {
  rentals: any[];
}

const initialState: RentalState = {
  rentals: [],
};

const rentalSlice = createSlice({
  name: 'rental',
  initialState,
  reducers: {
    setRentals: (state, action: PayloadAction<any[]>) => {
      state.rentals = action.payload;
    }
  }
});

export const { setRentals } = rentalSlice.actions;
export default rentalSlice.reducer;
