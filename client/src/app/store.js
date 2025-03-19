import { configureStore } from "@reduxjs/toolkit"
import authReducer from "../features/auth/authSlice"
import userReducer from "../features/users/userSlice"
import adminReducer from "../features/admin/adminSlice"

// Configure the Redux store
// This creates a store with our reducers
export const store = configureStore({
  reducer: {
    // Each slice of state is registered here
    auth: authReducer, // Handles authentication state
    users: userReducer, // Handles user data state
    admin: adminReducer, // Handles admin state
  },
})

