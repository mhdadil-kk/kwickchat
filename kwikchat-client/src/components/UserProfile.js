import React, { useState, useEffect } from 'react';

const UserProfile = () => {
  const [userName, setUserName] = useState('');
  const [newUserName, setNewUserName] = useState('');

  useEffect(() => {
    const storedUserName = localStorage.getItem('userName') || 'You';
    setUserName(storedUserName);
    setNewUserName(storedUserName);
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (newUserName.trim() !== '') {
      setUserName(newUserName);
      localStorage.setItem('userName', newUserName); // Store new name in localStorage
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-blue-500 to-indigo-500 text-white p-6">
      <h2 className="text-4xl font-bold text-center mb-8">Edit Profile</h2>

      {/* Profile Information */}
      <div className="bg-white text-black p-6 w-full md:w-3/4 lg:w-1/2 xl:w-1/3 mb-8 rounded-lg shadow-lg border border-gray-200">
        <h3 className="text-2xl font-semibold mb-4">Your Profile</h3>
        <p className="mb-4">Username: {userName}</p>
      </div>

      {/* Edit Name Form */}
      <form onSubmit={handleSubmit} className="w-full md:w-3/4 lg:w-1/2 xl:w-1/3">
        <input
          type="text"
          placeholder="Enter new name"
          value={newUserName}
          onChange={(e) => setNewUserName(e.target.value)}
          className="p-4 border rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 w-full mb-4 bg-white text-black"
        />
        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg shadow-md transition duration-300"
        >
          Update Name
        </button>
      </form>
    </div>
  );
};

export default UserProfile;
