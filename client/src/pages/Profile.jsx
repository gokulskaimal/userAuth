"use client";

import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { getProfile, updateProfile, uploadProfileImage, reset } from "../features/users/userSlice";
import { updateUser } from "../features/auth/authSlice";
import { toast } from "react-toastify";
import Spinner from "../components/Spinner";

function Profile() {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { profile, isLoading, isSuccess, isError, message } = useSelector((state) => state.users);

  const [formData, setFormData] = useState({
    name: "", 
    email: "",
    password: "",
    password2: "",
  });
  
  const [image, setImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");

  useEffect(() => {
    dispatch(getProfile());
    return () => {
      dispatch(reset());
    };
  }, [dispatch]);

  useEffect(() => {
    if (profile) {
      setFormData({
        name: profile.name || "",
        email: profile.email || "",
        password: "",
        password2: "",
      });
      if (profile.profileImage) {
        setPreviewUrl(profile.profileImage);
      }
    }
  }, [profile]);

  useEffect(() => {
    if (isSuccess && profile) {

      const user = JSON.parse(localStorage.getItem("user"));
      if (user) {
        dispatch(updateUser(user));
      }
    }
  }, [isSuccess, profile, dispatch]);

  const onChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  const onSubmit = (e) => {
    e.preventDefault();
  

    if (!formData.name.trim()) {
      toast.error("Name is required");
      return;
    } 
    if (formData.name.trim().length < 2) {
      toast.error("Name must be at least 2 characters");
      return;
    } 
    if (!/^[a-zA-Z\s]+$/.test(formData.name.trim())) {
      toast.error("Name should contain only letters and spaces");
      return;
    }
  
    // Email validation
    if (!formData.email.trim()) {
      toast.error("Email is required");
      return;
    } 
    if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(formData.email.trim())) {
      toast.error("Please enter a valid email address");
      return;
    }
  
    // Password validation - only if password is provided
    if (formData.password) {
      if (formData.password.length < 6) {
        toast.error("Password must be at least 6 characters");
        return;
      }
      if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) {
        toast.error("Password must include uppercase, lowercase, and number");
        return;
      }
      if (formData.password !== formData.password2) {
        toast.error("Passwords do not match");
        return;
      }
    }
  
    // Prepare data for submission - trim whitespace
    const updatedData = {
      name: formData.name.trim(),
      email: formData.email.trim(),
      password: formData.password || undefined,
    };
  
    dispatch(updateProfile(updatedData));
  };

  const onImageChange = (e) => {
    const file = e.target.files[0];
    
    if (!file) {
      return;
    }
    
    const allowedTypes = ["image/jpeg", "image/png", "image/jpg"];
    if (!allowedTypes.includes(file.type)) {
      toast.error("Only JPG, JPEG, and PNG files are allowed");
      return;
    }
    

    const maxSize = 2 * 1024 * 1024; 
    if (file.size > maxSize) {
      toast.error("File size must be less than 2MB");
      return;
    }

    setImage(file);
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviewUrl(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const onImageUpload = (e) => {
    e.preventDefault();
    if (!image) {
      toast.error("Please select an image to upload");
      return;
    }

    const formData = new FormData();
    formData.append("profileImage", image);
    dispatch(uploadProfileImage(formData));
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto bg-white shadow-xl rounded-xl p-6 lg:p-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8 tracking-tight">
          Your Profile
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-1 flex flex-col items-center">
            <div className="w-32 h-32 rounded-full overflow-hidden mb-4 bg-gray-200">
              {previewUrl ? (
                <img src={previewUrl} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-500">
                  No Image
                </div>
              )}
            </div>
            <form onSubmit={onImageUpload} className="w-full space-y-4">
              <div>
                <input
                  type="file"
                  id="profileImage"
                  onChange={onImageChange}
                  className="hidden"
                  accept="image/jpeg, image/png, image/jpg"
                />
                <label
                  htmlFor="profileImage"
                  className="block w-full px-4 py-2 bg-gray-600 text-white text-sm font-medium rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 text-center cursor-pointer transition duration-150 ease-in-out"
                >
                  Select Image
                </label>
              </div>
              <button
                type="submit"
                className="w-full px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-150 ease-in-out"
              >
                Upload Image
              </button>
            </form>
          </div>
          <div className="md:col-span-2">
            <form onSubmit={onSubmit} className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                  Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={onChange}
                  placeholder="Enter your name"
                  required
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-gray-700 placeholder-gray-400"
                />
              
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={onChange}
                  placeholder="Enter your email"
                  required
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-gray-700 placeholder-gray-400"
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
                  New Password
                </label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={onChange}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  placeholder="Leave blank to keep current password"
                />
        
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password2">
                  Confirm New Password
                </label>
                <input
                  type="password"
                  id="password2"
                  name="password2"
                  value={formData.password2}
                  onChange={onChange}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  placeholder="Confirm new password"
                />
              </div>
              <button
                type="submit"
                className="w-full px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-150 ease-in-out"
              >
                Update Profile
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;