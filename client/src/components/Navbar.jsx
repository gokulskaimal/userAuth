"use client";

import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../features/auth/authSlice";
import { adminLogout } from "../features/admin/adminSlice";

function Navbar() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { admin } = useSelector((state) => state.admin);

  const onLogout = () => {
    dispatch(logout());
    navigate("/");
  };

  const onAdminLogout = () => {
    dispatch(adminLogout());
    navigate("/");
  };

  return (
    <nav className="bg-indigo-600 text-white shadow-lg">
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          <Link to="/" className="text-2xl font-bold tracking-tight hover:text-indigo-200 transition duration-150 ease-in-out">
            User Management
          </Link>

          <div className="flex items-center space-x-6">
            {user ? (
              <>
                <span className="text-sm font-medium">Welcome, {user.name}</span>
                <Link
                  to="/profile"
                  className="text-sm font-medium hover:text-indigo-200 transition duration-150 ease-in-out"
                >
                  Profile
                </Link>
                <button
                  onClick={onLogout}
                  className="text-sm font-medium hover:text-indigo-200 transition duration-150 ease-in-out"
                >
                  Logout
                </button>
              </>
            ) : admin ? (
              <>
                <span className="text-sm font-medium">Welcome,  {admin.name}</span>
                <Link
                  to="/admin/dashboard"
                  className="text-sm font-medium hover:text-indigo-200 transition duration-150 ease-in-out"
                >
                  Dashboard
                </Link>
                <button
                  onClick={onAdminLogout}
                  className="text-sm font-medium hover:text-indigo-200 transition duration-150 ease-in-out"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="text-sm font-medium hover:text-indigo-200 transition duration-150 ease-in-out"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="text-sm font-medium hover:text-indigo-200 transition duration-150 ease-in-out"
                >
                  Register
                </Link>
                <Link
                  to="/admin/login"
                  className="text-sm font-medium hover:text-indigo-200 transition duration-150 ease-in-out"
                >
                  Admin
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;