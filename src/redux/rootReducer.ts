// src/redux/rootReducer.ts
import { combineReducers } from 'redux';
import authReducer from './authSlice'; // Your auth slice
// import other reducers here...

const rootReducer = combineReducers({
  auth: authReducer,
  // Add other reducers here
});

export default rootReducer;