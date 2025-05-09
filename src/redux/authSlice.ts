import { createSlice } from '@reduxjs/toolkit';

interface AuthState {
  isAuthenticated: boolean;
  userId: string | null;  // Make sure to include null in the type
};

const initialState: AuthState = {
  isAuthenticated: false,
  userId: null
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    login(state, action) {
      state.isAuthenticated = true;
      state.userId = action.payload;  // This should be just the userId string
    },
    logout(state) {
      state.isAuthenticated = false;
      state.userId = null;
    }
  }
});

export const { login, logout } = authSlice.actions;
export default authSlice.reducer;