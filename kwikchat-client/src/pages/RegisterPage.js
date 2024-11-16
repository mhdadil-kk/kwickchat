import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { GoogleLogin } from '@react-oauth/google';

const RegisterPage = () => {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  // Redirect if already logged in
  useEffect(() => {
    const token = localStorage.getItem('token'); // Check if token exists
    if (token) {
      navigate('/'); // Redirect to home or dashboard if already logged in
    }
  }, [navigate]);

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      // Sending name along with email and password to the backend
      const response = await axios.post('https://kwickchat.adilkk.online/api/auth/register', { name, email, password });
      alert('Registration successful! Please log in.');
      navigate('/login');
    } catch (err) {
      setError('Registration failed. Please try again.');
      console.error(err);
    }
  };

  const handleGoogleLogin = async (response) => {
    try {
      const googleToken = response.credential;
      const res = await axios.post('http://localhost:5000/api/auth/google-login', { token: googleToken });
      if (res.data.success) {
        // Store the token in local storage
        localStorage.setItem('token', res.data.token);
        navigate('/');  // Redirect to the home or dashboard page after successful login
      }
    } catch (error) {
      console.error(error);
      setError('Google login failed. Please try again.');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-green-400 to-teal-500 text-white p-4">
      <h2 className="text-3xl font-bold mb-6">Register</h2>

      {/* Registration Form */}
      <form 
        className="flex flex-col gap-6 bg-white text-black w-full max-w-md p-6 rounded-lg shadow-lg" 
        onSubmit={handleRegister}
      >
        {/* Name Input */}
        <input
          type="text"
          placeholder="Name"
          className="p-3 border rounded-lg shadow focus:outline-none focus:ring focus:ring-green-400"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        {/* Email Input */}
        <input
          type="email"
          placeholder="Email"
          className="p-3 border rounded-lg shadow focus:outline-none focus:ring focus:ring-green-400"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        {/* Password Input */}
        <input
          type="password"
          placeholder="Password"
          className="p-3 border rounded-lg shadow focus:outline-none focus:ring focus:ring-green-400"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        {/* Register Button */}
        <button 
          type="submit" 
          className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg shadow-md transition-all"
        >
          Register
        </button>
      </form>

      {/* Error Message */}
      {error && <p className="text-red-500 mt-4">{error}</p>}

      {/* Google Login Button */}
      <div className="mt-6">
        <GoogleLogin 
          onSuccess={handleGoogleLogin} 
          onError={(error) => setError('Google login failed. Please try again.')} 
        />
      </div>

      {/* Login Link */}
      <p className="mt-6 text-sm">
        Already have an account?{' '}
        <Link to="/login" className="text-yellow-300 hover:underline">
          Login here
        </Link>
      </p>
    </div>
  );
};

export default RegisterPage;
