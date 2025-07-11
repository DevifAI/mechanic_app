// redux/slices/authSlice.ts

import {createSlice, PayloadAction} from '@reduxjs/toolkit';

interface AuthState {
  isAuthenticated: boolean;
  userId: string | null;
  role: string | null;
  orgId?: string | null;
  userName?: string | null;
  token?: string | null;
  projectId?: string | null;
  projectList?: any[];
  selectedProjectNumber?: string | null;
  activeTab: 'Submitted' | 'Approvals' | 'Issued' | 'Rejected' | 'All';
  activeTab2: 'Submitted' | 'Approved' | 'Rejected' | 'All';
  activeTab3 : 'Draft' | 'Invoiced' | 'Rejected' | 'All';
}

const initialState: AuthState = {
  isAuthenticated: false,
  userId: null,
  role: null,
  orgId: null,
  userName: null,
  projectId: null,
  token: null,
  projectList: [],
  selectedProjectNumber: null, 
  activeTab: 'Submitted',
  activeTab2: 'Submitted',
  activeTab3: 'All'
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
        token: string;
      }>
    ) {
      state.isAuthenticated = true;
      state.userId = action.payload.userId;
      state.role = action.payload.role;
      state.orgId = action.payload.orgId;
      state.token = action.payload.token;
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
    updateCurrenttab2: (
      state,
      action: PayloadAction<'Submitted' | 'Approved' | 'Rejected' | 'All'>,
    ) => {
      console.log('updating current tab', action.payload);
      return {
        ...state,
        activeTab2: action.payload,
      };
    },
     updateCurrenttab3: (
      state,
      action: PayloadAction<'Draft' | 'Invoiced' | 'Rejected' | 'All'>,
    ) => {
      console.log('updating current tab', action.payload);
      return {
        ...state,
        activeTab3: action.payload,
      };
    },
    logout(state) {
      state.isAuthenticated = false;
      state.userId = null;
      state.role = null;
      state.orgId = null;
      state.userName = null;
      state.token = null;
      state.projectId = null;
      state.projectList = [];
      state.selectedProjectNumber = null; // ✅ Reset on logout
      state.activeTab = 'Submitted';
      state.activeTab2 = 'Submitted';
       state.activeTab2 = 'All';
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
  updateCurrenttab2,
  updateCurrenttab3,
} = authSlice.actions;

export default authSlice.reducer;
