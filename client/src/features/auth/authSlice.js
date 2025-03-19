import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import authService from "./authService"
import { toast } from "react-toastify"

// Get user from localStorage
const user = JSON.parse(localStorage.getItem("user"))

// Initial state for the auth slice
const initialState = {
  user: user ? user : null,
  isLoading: false,
  isSuccess: false,
  isError: false,
  message: "",
}

// Register user async thunk
// This is an async action creator that will handle the API call
export const register = createAsyncThunk("auth/register", async (userData, thunkAPI) => {
  try {
    // Call the register method from our authService
    const response = await authService.register(userData)
    toast.success("Registration successful!")
    return response
  } catch (error) {
    // Get the error message to display to the user
    const message = error.response?.data?.message || error.message || "Something went wrong"
    toast.error(message)
    // Return the error message as the rejected value
    return thunkAPI.rejectWithValue(message)
  }
})

// Login user async thunk
export const login = createAsyncThunk("auth/login", async (userData, thunkAPI) => {
  try {
    // Call the login method from our authService
    const response = await authService.login(userData)
    toast.success("Login successful!")
    return response
  } catch (error) {
    // Get the error message to display to the user
    const message = error.response?.data?.message || error.message || "Invalid credentials"
    toast.error(message)
    // Return the error message as the rejected value
    return thunkAPI.rejectWithValue(message)
  }
})

// Logout user
export const logout = createAsyncThunk("auth/logout", async () => {
  // Call the logout method from our authService
  authService.logout()
  toast.info("Logged out successfully")
})

// Auth slice
export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    // Reset the state (used after actions complete)
    reset: (state) => {
      state.isLoading = false
      state.isSuccess = false
      state.isError = false
      state.message = ""
    },
  },
  extraReducers: (builder) => {
    builder
      // Register cases
      .addCase(register.pending, (state) => {
        state.isLoading = true
      })
      .addCase(register.fulfilled, (state, action) => {
        state.isLoading = false
        state.isSuccess = true
        state.user = action.payload
      })
      .addCase(register.rejected, (state, action) => {
        state.isLoading = false
        state.isError = true
        state.message = action.payload
        state.user = null
      })
      // Login cases
      .addCase(login.pending, (state) => {
        state.isLoading = true
      })
      .addCase(login.fulfilled, (state, action) => {
        state.isLoading = false
        state.isSuccess = true
        state.user = action.payload
      })
      .addCase(login.rejected, (state, action) => {
        state.isLoading = false
        state.isError = true
        state.message = action.payload
        state.user = null
      })
      // Logout case
      .addCase(logout.fulfilled, (state) => {
        state.user = null
      })
  },
})

export const { reset } = authSlice.actions
export default authSlice.reducer

