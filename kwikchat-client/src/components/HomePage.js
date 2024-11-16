import React from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate for routing

const HomePage = () => {
  const navigate = useNavigate(); // Hook to navigate programmatically
  
  const handleStartChat = () => {
    const token = localStorage.getItem('token'); // Check if the user has a valid token
    
    if (token) {
      // If the user is logged in, navigate to the chat page
      navigate('/chat');
    } else {
      // If the user is not logged in, redirect to the login page
      navigate('/login');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-blue-400 to-indigo-600 text-white p-6">
    {/* Welcome Title */}
    <h1 className="text-5xl font-bold text-center mb-8 drop-shadow-lg">
      Welcome to KWICKCHAT
    </h1>
  
    {/* Start Chat Button */}
    <button
      onClick={handleStartChat}
      className="px-8 py-4 bg-blue-600 text-white font-semibold rounded-full shadow-lg hover:bg-blue-700 transition-all duration-300 transform hover:scale-105"
    >
      Start Chat with Stranger
    </button>
  </div>
  
  );
};

export default HomePage;
