import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const LoginPage = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  // Redirect if already logged in
  useEffect(() => {
    const token = localStorage.getItem('token'); // Check if token exists
    if (token) {
      navigate('/'); // Redirect to home if already logged in
    }
  }, [navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('https://kwickchat.adilkk.online/api/auth/login', { email, password });
      localStorage.setItem('token', response.data.token); 
      localStorage.setItem('userName', response.data.name);
      navigate('/'); // Redirect to home page after successful login
    } catch (err) {
      setError('Invalid credentials. Please try again.');
      console.error(err);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-blue-500 to-indigo-500 text-white p-4">
      <h2 className="text-3xl font-bold mb-6">Login</h2>
      
      {/* Login Form */}
      <form 
        className="flex flex-col gap-6 bg-white text-black w-full max-w-md p-6 rounded-lg shadow-lg" 
        onSubmit={handleLogin}
      >
        {/* Email Input */}
        <input
          type="email"
          placeholder="Email"
          className="p-3 border rounded-lg shadow focus:outline-none focus:ring focus:ring-blue-400"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        {/* Password Input */}
        <input
          type="password"
          placeholder="Password"
          className="p-3 border rounded-lg shadow focus:outline-none focus:ring focus:ring-blue-400"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        {/* Login Button */}
        <button 
          type="submit" 
          className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow-md transition-all"
        >
          Login
        </button>
      </form>
      
      {/* Error Message */}
      {error && <p className="text-red-500 mt-4">{error}</p>}

      {/* Register Link */}
      <p className="mt-6 text-sm">
        Don't have an account?{' '}
        <Link to="/register" className="text-yellow-300 hover:underline">
          Register here
        </Link>
      </p>
    </div>
  );
};

export default LoginPage;
