// redux/slices/authSlice.ts

import {createSlice, PayloadAction} from '@reduxjs/toolkit';

interface AuthState {
  isAuthenticated: boolean;
  userId: string | null;
  role: string | null;
  orgId?: string | null;
  userName?: string | null;
  projectId?: string | null;
  projectList?: any[];
  selectedProjectNumber?: string | null; // ✅ New field
  activeTab: 'Submitted' | 'Approvals' | 'Issued' | 'Rejected' | 'All';
}

const initialState: AuthState = {
  isAuthenticated: false,
  userId: null,
  role: null,
  orgId: null,
  userName: null,
  projectId: null,
  projectList: [],
  selectedProjectNumber: null, // ✅ Initialize
  activeTab: 'Submitted',
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
      }>
    ) {
      state.isAuthenticated = true;
      state.userId = action.payload.userId;
      state.role = action.payload.role;
      state.orgId = action.payload.orgId;
      state.userName = action.payload.userName || null;
    },
    updateCurrentProject: (state, action: PayloadAction<string>) => {
      return {
        ...state,
        projectId: action.payload,
      };
    },
    updateProjectList: (state, action: PayloadAction<any[]>) => {
      return {
        ...state,
        projectList: action.payload,
      };
    },
    updateSelectedProjectNumber: (state, action: PayloadAction<string>) => {
      return {
        ...state,
        selectedProjectNumber: action.payload, // ✅ New reducer
      };
    },
    updateCurrenttab: (
      state,
      action: PayloadAction<'Submitted' | 'Approvals' | 'Issued' | 'Rejected' | 'All'>,
    ) => {
      console.log('updating current tab', action.payload);
      return {
        ...state,
        activeTab: action.payload,
      };
    },
    logout(state) {
      state.isAuthenticated = false;
      state.userId = null;
      state.role = null;
      state.orgId = null;
      state.userName = null;
      state.projectId = null;
      state.projectList = [];
      state.selectedProjectNumber = null; // ✅ Reset on logout
      state.activeTab = 'Submitted';
    },
  },
});

export const {
  login,
  logout,
  updateCurrentProject,
  updateProjectList,
  updateSelectedProjectNumber, // ✅ Export the new action
  updateCurrenttab,
} = authSlice.actions;

export default authSlice.reducer;
