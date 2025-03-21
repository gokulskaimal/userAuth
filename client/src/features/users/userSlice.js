import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import userService from "./userService"
import { toast } from "react-toastify"
import { updateUser } from '../auth/authSlice';
import { store } from '../../app/store';  
// Initial state for the user slice
const initialState = {
  profile: null,
  isLoading: false,
  isSuccess: false,
  isError: false,
  message: "",
}

// Get user profile
// Standardize error handling
export const getProfile = createAsyncThunk("users/getProfile", async (_, thunkAPI) => {
  try {
    const token = thunkAPI.getState().auth.user.token
    return await userService.getProfile(token)
  } catch (error) {
    const message = 
      (error.response && 
       error.response.data && 
       error.response.data.message) ||
      error.message || 
      "Failed to fetch profile"
    toast.error(message)
    return thunkAPI.rejectWithValue(message)
  }
})

// Update user profile
export const updateProfile = createAsyncThunk("users/updateProfile", async (userData, thunkAPI) => {
  try {
    // Get the token from the auth state
    const token = thunkAPI.getState().auth.user.token
    const response = await userService.updateProfile(userData, token)
    toast.success("Profile updated successfully!")
    return response
  } catch (error) {
    const message = error.response?.data?.message || error.message || "Failed to update profile"
    toast.error(message)
    return thunkAPI.rejectWithValue(message)
  }
})

// Upload profile image
export const uploadProfileImage = createAsyncThunk("users/uploadProfileImage", async (formData, thunkAPI) => {
  try {
    // Get the token from the auth state
    const token = thunkAPI.getState().auth.user.token
    const response = await userService.uploadProfileImage(formData, token)
    toast.success("Profile image uploaded successfully!")
    return response
  } catch (error) {
    const message = error.response?.data?.message || error.message || "Failed to upload image"
    toast.error(message)
    return thunkAPI.rejectWithValue(message)
  }
})

// User slice
export const userSlice = createSlice({
  name: "users",
  initialState,
  reducers: {
    reset: (state) => {
      state.isLoading = false
      state.isSuccess = false
      state.isError = false
      state.message = ""
    },
    // Add a new reducer to update auth state from profile
    syncProfileWithAuth: (state) => {
      // This will be used to trigger an effect that updates auth state
      state.isSuccess = true
    },
  },
  extraReducers: (builder) => {
    builder
      // Get profile cases
      .addCase(getProfile.pending, (state) => {
        state.isLoading = true
      })
      .addCase(getProfile.fulfilled, (state, action) => {
        state.isLoading = false
        state.isSuccess = true
        state.profile = action.payload
      })
      .addCase(getProfile.rejected, (state, action) => {
        state.isLoading = false
        state.isError = true
        state.message = action.payload
      })
      // Update profile cases
      .addCase(updateProfile.pending, (state) => {
        state.isLoading = true
      })
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.profile = action.payload;
        
        // Update localStorage directly
        if (action.payload.token) {
          const user = JSON.parse(localStorage.getItem("user"));
          if (user) {
            const updatedUser = {
              ...user,
              name: action.payload.name,
              email: action.payload.email,
              profileImage: action.payload.profileImage,
              token: action.payload.token
            };
            localStorage.setItem("user", JSON.stringify(updatedUser));
            
            // Instead of dispatching here, set a flag that will trigger an effect
            state.syncNeeded = true;
          }
        }
      })
      .addCase(uploadProfileImage.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.profile = action.payload;
        
        // Update localStorage directly
        if (action.payload.token) {
          const user = JSON.parse(localStorage.getItem("user"));
          if (user) {
            const updatedUser = {
              ...user,
              name: action.payload.name,
              email: action.payload.email,
              profileImage: action.payload.profileImage,
              token: action.payload.token
            };
            localStorage.setItem("user", JSON.stringify(updatedUser));
            
            // Instead of dispatching here, set a flag that will trigger an effect
            state.syncNeeded = true;
          }
        }
      })
      .addCase(uploadProfileImage.rejected, (state, action) => {
        state.isLoading = false
        state.isError = true
        state.message = action.payload
      })
  },
})

export const { reset, syncProfileWithAuth } = userSlice.actions
export default userSlice.reducer

