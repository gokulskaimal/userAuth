import axios from "axios"

// API URL
const API_URL = "/api/admin/"

// Admin login
const login = async (adminData) => {
  const response = await axios.post(API_URL + "login", adminData)

  if (response.data) {
    localStorage.setItem("admin", JSON.stringify(response.data))
  }

  return response.data
}

// Admin logout
const logout = () => {
  localStorage.removeItem("admin")
}

// Get all users
const getUsers = async (token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }

  const response = await axios.get(API_URL + "users", config)
  return response.data
}

// Create new user
const createUser = async (userData, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }

  const response = await axios.post(API_URL + "users", userData, config)
  return response.data
}

// Update user
const updateUser = async (id, userData, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }

  const response = await axios.put(API_URL + `users/${id}`, userData, config)
  return response.data
}

// Delete user
const deleteUser = async (id, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }

  const response = await axios.delete(API_URL + `users/${id}`, config)
  return response.data
}

const adminService = {
  login,
  logout,
  getUsers,
  createUser,
  updateUser,
  deleteUser,
}

export default adminService

