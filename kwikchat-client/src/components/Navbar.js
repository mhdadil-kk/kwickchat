import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaUser } from 'react-icons/fa'; // Import the profile icon from React Icons

const Navbar = () => {
  const token = localStorage.getItem('token'); // Check if user is logged in
  const userName = localStorage.getItem('userName'); // Get username from localStorage (or another source)
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token'); // Clear the token
    localStorage.removeItem('userName'); // Optionally clear user name
    navigate('/login'); // Redirect to login page after logout
  };

  return (
    <nav className="flex justify-between items-center p-4 bg-blue-600 text-white">
      <div className="text-xl font-bold">KWICKCHAT</div>

      {/* Navigation Links */}
      <div className="space-x-4 flex items-center">
        <Link to="/" className="hover:text-gray-300 transition-colors duration-200">
          Home
        </Link>

        {token ? (
          <div className="flex items-center space-x-4">
            {/* Display User Profile Link with Profile Icon */}
            <Link
              to="/user-profile"
              className="flex items-center space-x-2 hover:text-gray-300 transition-colors duration-200"
            >
              {/* Profile Icon */}
              <FaUser className="w-5 h-5 text-white" /> {/* Use React Icon for profile */}
              <span>{userName ? userName : 'User'}</span> {/* Display username */}
            </Link>

            {/* Logout Button */}
            <button
              onClick={handleLogout}
              className="hover:text-gray-300 bg-red-500 text-white px-4 py-2 rounded-full transition-colors duration-200"
              >
              Logout
            </button>
          </div>
        ) : (
          <>
            <Link to="/login" className="hover:text-gray-300 transition-colors duration-200">
              Login
            </Link>
            <Link to="/register" className="hover:text-gray-300 transition-colors duration-200">
              Register
            </Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
