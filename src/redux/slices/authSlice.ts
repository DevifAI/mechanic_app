// redux/slices/authSlice.ts

import {createSlice, PayloadAction} from '@reduxjs/toolkit';

interface AuthState {
  isAuthenticated: boolean;
  userId: string | null;
  role: string | null; // Add this
  orgId?: string | null; // Optional orgId field
  userName?: string | null; // Optional username field
}

const initialState: AuthState = {
  isAuthenticated: false,
  userId: null,
  role: null,
  orgId: null, // Initialize orgId
  userName: null, // Optional username field
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    login(
      state,
      action: PayloadAction<{
        userId: string;
        role: string;
        orgId: string;
        userName: string;
      }>, // Add orgId and optional userName
    ) {
      state.isAuthenticated = true;
      state.userId = action.payload.userId;
      state.role = action.payload.role;
      state.orgId = action.payload.orgId; // Add orgId to state
      state.userName = action.payload.userName || null; // Optional username field
    },
    logout(state) {
      state.isAuthenticated = false;
      state.userId = null;
      state.role = null;
      state.orgId = null; // Reset orgId on logout
      state.userName = null; // Reset username on logout
    },
  },
});

export const {login, logout} = authSlice.actions;
export default authSlice.reducer;
