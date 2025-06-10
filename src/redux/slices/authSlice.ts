// redux/slices/authSlice.ts

import {createSlice, PayloadAction} from '@reduxjs/toolkit';

interface AuthState {
  isAuthenticated: boolean;
  userId: string | null;
  role: string | null; // Add this
  orgId?: string | null; // Optional orgId field
  userName?: string | null; // Optional username field
  projectId?: string | null; // Optional projectId field
  projectList?: any[]; // Optional projectList field
  activeTab: 'Submitted' | 'Approvals' | 'Issued'| 'Rejected' | 'All';
}

const initialState: AuthState = {
  isAuthenticated: false,
  userId: null,
  role: null,
  orgId: null, // Initialize orgId
  userName: null, // Optional username field
  projectId: null, // Optional projectId field
  projectList: [], // Initialize projectList,
  activeTab: 'Submitted', // Default current tab
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
    updateCurrentProject: (state, action: PayloadAction<string>) => {
      return {
        ...state,
        projectId: action.payload, // Update orgId with the new value
      };
    },
    updateProjectList: (state, action: PayloadAction<any[]>) => {
      return {
        ...state,
        projectList: action.payload, // Update projectList with the new value
      };
    },

    updateCurrenttab: (
      state,
      action: PayloadAction<'Submitted' | 'Approvals' | 'Issued'| 'Rejected' | 'All'>,
    ) => {
      console.log('updating current tab', action.payload);
      return {
        ...state,
        activeTab: action.payload, // Update currentTab with the new value
      };
    },
    logout(state) {
      state.isAuthenticated = false;
      state.userId = null;
      state.role = null;
      state.orgId = null; // Reset orgId on logout
      state.userName = null; // Reset username on logout
      state.projectId = null; // Reset projectId on logout
      state.projectList = []; // Reset projectList on logout,
      state.activeTab = 'Submitted'; // Reset activeTab to default on logout
    },
  },
});

export const {
  login,
  logout,
  updateCurrentProject,
  updateProjectList,
  updateCurrenttab,
} = authSlice.actions;
export default authSlice.reducer;
