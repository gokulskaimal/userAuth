import axios from "axios"

// API URL
const API_URL = "/api/users/"

// Get user profile
const getProfile = async (token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }

  const response = await axios.get(API_URL + "profile", config)
  return response.data
}

// Update user profile
const updateProfile = async (userData, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }

  const response = await axios.put(API_URL + "profile", userData, config)
  return response.data
}

// Upload profile image
const uploadProfileImage = async (formData, token) => {
  const config = {
    headers: {
      "Content-Type": "multipart/form-data",
      Authorization: `Bearer ${token}`,
    },
  }

  const response = await axios.post(API_URL + "profile/upload", formData, config)
  return response.data
}

const userService = {
  getProfile,
  updateProfile,
  uploadProfileImage,
}

export default userService

