import { useEffect } from "react";
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { getProfile } from "../features/users/userSlice";
import Spinner from "../components/Spinner";

function Dashboard() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { user } = useSelector((state) => state.auth);
  const { profile, isLoading } = useSelector((state) => state.users);

  // Use profile data if available, otherwise fallback to user data
  const displayName = profile?.name || user?.name;
  const displayEmail = profile?.email || user?.email;
  const displayImage = profile?.profileImage || user?.profileImage || "https://via.placeholder.com/150"; // Fallback image

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }

    // Fetch latest profile data
    dispatch(getProfile());
  }, [user, navigate, dispatch]);

  // Function to safely format date
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    try {
      return new Date(dateString).toLocaleDateString();
    } catch (error) {
      return "Invalid Date";
    }
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
      <div className="max-w-4xl mx-auto bg-white shadow-2xl rounded-xl p-6 lg:p-8">
        <h1 className="text-4xl font-extrabold text-gray-900 mb-8 text-center">Dashboard</h1>

        {/* User Info Card */}
        <div className="bg-gray-50 p-6 rounded-lg shadow-md transition-transform transform hover:scale-[1.02] duration-200">
          <div className="flex items-center space-x-4 mb-6">
            <img
              src={displayImage}
              alt="No Pic"
              className="w-20 h-20 rounded-full object-cover border-2 border-indigo-500 shadow-sm"
            />
            <div>
              <h2 className="text-2xl font-semibold text-gray-800">Welcome, {displayName}!</h2>
            </div>
          </div>

          <div className="space-y-4">
            <div className="grid grid-cols-3 gap-4 items-center">
              <span className="text-gray-600 font-medium">Name:</span>
              <span className="text-gray-800 font-semibold col-span-2">{displayName}</span>
            </div>
            <div className="grid grid-cols-3 gap-4 items-center">
              <span className="text-gray-600 font-medium">Email:</span>
              <span className="text-gray-800 font-semibold col-span-2">{displayEmail}</span>
            </div>
            {profile && profile.bio && (
              <div className="pt-2">
                <span className="text-gray-600 font-medium block mb-1">Bio:</span>
                <p className="text-gray-700 italic bg-gray-100 p-2 rounded-md">{profile.bio}</p>
              </div>
            )}
            {profile && profile.createdAt && (
              <div className="grid grid-cols-3 gap-4 items-center">
                <span className="text-gray-600 font-medium">Joined:</span>
                <span className="text-gray-800 font-semibold col-span-2">{formatDate(profile.createdAt)}</span>
              </div>
            )}
          </div>

          <Link
            to="/profile"
            className="mt-6 inline-flex items-center px-5 py-2 bg-indigo-600 text-white text-sm font-medium rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-200 ease-in-out"
          >
            View Profile
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;