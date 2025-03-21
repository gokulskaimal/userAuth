"use client"

import { useState, useEffect } from "react"
import { toast } from "react-toastify"

function UserForm({ user, onSubmit, onCancel }) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    password2: "",
    // Remove bio field
  })

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "",
        email: user.email || "",
        password: "",
        password2: "",
        // Remove bio field
      })
    }
  }, [user])

  const onChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    // Validate form
    if (!formData.name || !formData.email) {
      toast.error("Name and email are required")
      return
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(formData.email)) {
      toast.error("Please enter a valid email address")
      return
    }

    // If creating new user, validate password
    if (!user) {
      if (!formData.password) {
        toast.error("Password is required")
        return
      }

      // Standardize password validation
      if (formData.password.length < 6) {
        toast.error("Password must be at least 6 characters")
        return
      }

      // Consider adding stronger validation if needed:
      // const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{6,}$/
      // if (!passwordRegex.test(formData.password)) {
      //   toast.error("Password must include at least one uppercase letter, one lowercase letter, and one number")
      //   return
      // }

      if (formData.password !== formData.password2) {
        toast.error("Passwords do not match")
        return
      }
    }

    // If updating user and password field is filled, validate it
    if (user && formData.password) {
      if (formData.password.length < 6) {
        toast.error("Password must be at least 6 characters")
        return
      }

      if (formData.password !== formData.password2) {
        toast.error("Passwords do not match")
        return
      }
    }

    // Prepare data for submission
    const userData = {
      name: formData.name,
      email: formData.email,
      bio: formData.bio,
    }

    // Only include password if it's provided
    if (formData.password) {
      userData.password = formData.password
    }

    onSubmit(userData)
  }

  return (
    <div className="bg-gray-50 p-6 rounded-lg mb-6">
      <h2 className="text-xl font-semibold mb-4">{user ? "Edit User" : "Create New User"}</h2>

      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="name" className="block text-gray-700 mb-2">
            Name
          </label>
          <input
            type="text"
            className="form-input"
            id="name"
            name="name"
            value={formData.name}
            onChange={onChange}
            placeholder="Enter name"
            required
          />
        </div>

        <div className="mb-4">
          <label htmlFor="email" className="block text-gray-700 mb-2">
            Email
          </label>
          <input
            type="email"
            className="form-input"
            id="email"
            name="email"
            value={formData.email}
            onChange={onChange}
            placeholder="Enter email"
            required
          />
        </div>

        <div className="mb-4">
          <label htmlFor="password" className="block text-gray-700 mb-2">
            Password {user && "(Leave blank to keep current password)"}
          </label>
          <input
            type="password"
            className="form-input"
            id="password"
            name="password"
            value={formData.password}
            onChange={onChange}
            placeholder={user ? "Leave blank to keep current" : "Enter password"}
            required={!user}
          />
        </div>

        <div className="mb-4">
          <label htmlFor="password2" className="block text-gray-700 mb-2">
            Confirm Password
          </label>
          <input
            type="password"
            className="form-input"
            id="password2"
            name="password2"
            value={formData.password2}
            onChange={onChange}
            placeholder="Confirm password"
            required={!user || formData.password !== ""}
          />
        </div>

        <div className="mb-6">
          <label htmlFor="bio" className="block text-gray-700 mb-2">
            Bio
          </label>
          <textarea
            className="form-input"
            id="bio"
            name="bio"
            value={formData.bio}
            onChange={onChange}
            placeholder="User bio"
            rows="3"
          ></textarea>
        </div>

        <div className="flex justify-end space-x-4">
          <button type="button" onClick={onCancel} className="btn btn-secondary">
            Cancel
          </button>
          <button type="submit" className="btn btn-primary">
            {user ? "Update User" : "Create User"}
          </button>
        </div>
      </form>
    </div>
  )
}

export default UserForm

