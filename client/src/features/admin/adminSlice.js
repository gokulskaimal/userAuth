import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import adminService from "./adminService"
import { toast } from "react-toastify"

// Get admin from localStorage
const admin = JSON.parse(localStorage.getItem("admin"))

// Initial state for the admin slice
const initialState = {
  admin: admin ? admin : null,
  users: [],
  selectedUser: null,
  isLoading: false,
  isSuccess: false,
  isError: false,
  message: "",
}

// Admin login
export const adminLogin = createAsyncThunk("admin/login", async (adminData, thunkAPI) => {
  try {
    const response = await adminService.login(adminData)
    toast.success("Admin login successful!")
    return response
  } catch (error) {
    const message = error.response?.data?.message || error.message || "Invalid admin credentials"
    toast.error(message)
    return thunkAPI.rejectWithValue(message)
  }
})

// Admin logout
export const adminLogout = createAsyncThunk("admin/logout", async () => {
  adminService.logout()
  toast.info("Admin logged out successfully")
})

// Get all users
export const getUsers = createAsyncThunk("admin/getUsers", async (_, thunkAPI) => {
  try {
    const token = thunkAPI.getState().admin.admin.token
    return await adminService.getUsers(token)
  } catch (error) {
    const message = error.response?.data?.message || error.message || "Failed to fetch users"
    toast.error(message)
    return thunkAPI.rejectWithValue(message)
  }
})

// Create new user
export const createUser = createAsyncThunk("admin/createUser", async (userData, thunkAPI) => {
  try {
    const token = thunkAPI.getState().admin.admin.token
    const response = await adminService.createUser(userData, token)
    toast.success("User created successfully!")
    return response
  } catch (error) {
    const message = error.response?.data?.message || error.message || "Failed to create user"
    toast.error(message)
    return thunkAPI.rejectWithValue(message)
  }
})

// Update user
export const updateUser = createAsyncThunk("admin/updateUser", async ({ id, userData }, thunkAPI) => {
  try {
    const token = thunkAPI.getState().admin.admin.token
    const response = await adminService.updateUser(id, userData, token)
    toast.success("User updated successfully!")
    return response
  } catch (error) {
    const message = error.response?.data?.message || error.message || "Failed to update user"
    toast.error(message)
    return thunkAPI.rejectWithValue(message)
  }
})

// Delete user
export const deleteUser = createAsyncThunk("admin/deleteUser", async (id, thunkAPI) => {
  try {
    const token = thunkAPI.getState().admin.admin.token
    await adminService.deleteUser(id, token)
    toast.success("User deleted successfully!")
    return id
  } catch (error) {
    const message = error.response?.data?.message || error.message || "Failed to delete user"
    toast.error(message)
    return thunkAPI.rejectWithValue(message)
  }
})

// Admin slice
export const adminSlice = createSlice({
  name: "admin",
  initialState,
  reducers: {
    reset: (state) => {
      state.isLoading = false
      state.isSuccess = false
      state.isError = false
      state.message = ""
    },
    setSelectedUser: (state, action) => {
      state.selectedUser = action.payload
    },
  },
  extraReducers: (builder) => {
    builder
      // Admin login cases
      .addCase(adminLogin.pending, (state) => {
        state.isLoading = true
      })
      .addCase(adminLogin.fulfilled, (state, action) => {
        state.isLoading = false
        state.isSuccess = true
        state.admin = action.payload
      })
      .addCase(adminLogin.rejected, (state, action) => {
        state.isLoading = false
        state.isError = true
        state.message = action.payload
        state.admin = null
      })
      // Admin logout case
      .addCase(adminLogout.fulfilled, (state) => {
        state.admin = null
      })
      // Get users cases
      .addCase(getUsers.pending, (state) => {
        state.isLoading = true
      })
      .addCase(getUsers.fulfilled, (state, action) => {
        state.isLoading = false
        state.isSuccess = true
        state.users = action.payload
      })
      .addCase(getUsers.rejected, (state, action) => {
        state.isLoading = false
        state.isError = true
        state.message = action.payload
      })
      // Create user cases
      .addCase(createUser.pending, (state) => {
        state.isLoading = true
      })
      .addCase(createUser.fulfilled, (state, action) => {
        state.isLoading = false
        state.isSuccess = true
        // Add the newly created user to the users array
        state.users.unshift(action.payload) // Add to the beginning of the array
      })
      .addCase(createUser.rejected, (state, action) => {
        state.isLoading = false
        state.isError = true
        state.message = action.payload
      })
      // Update user cases
      .addCase(updateUser.pending, (state) => {
        state.isLoading = true
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.isLoading = false
        state.isSuccess = true
        state.users = state.users.map((user) => (user._id === action.payload._id ? action.payload : user))
        state.selectedUser = null
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.isLoading = false
        state.isError = true
        state.message = action.payload
      })
      // Delete user cases
      .addCase(deleteUser.pending, (state) => {
        state.isLoading = true
      })
      .addCase(deleteUser.fulfilled, (state, action) => {
        state.isLoading = false
        state.isSuccess = true
        state.users = state.users.filter((user) => user._id !== action.payload)
      })
      .addCase(deleteUser.rejected, (state, action) => {
        state.isLoading = false
        state.isError = true
        state.message = action.payload
      })
  },
})

export const { reset, setSelectedUser } = adminSlice.actions
export default adminSlice.reducer

