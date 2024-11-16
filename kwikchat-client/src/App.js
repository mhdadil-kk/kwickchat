import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { GoogleOAuthProvider } from '@react-oauth/google';  // Import GoogleOAuthProvider
import Navbar from './components/Navbar';
import HomePage from './components/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ChatPage from './pages/ChatPage';
import UserProfile from './components/UserProfile'; // Import UserProfile component
import ProtectedRoute from './components/ProtectedRoute';

const App = () => {
  return (
    <GoogleOAuthProvider clientId="1093115405015-pcikskk15q5867c27fqcr7ph7bkculr0.apps.googleusercontent.com">  {/* Add your Google Client ID here */}
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* User Profile Route */}
          <Route path="/user-profile" element={<UserProfile />} />

          {/* Protect the Chat page route */}
          <Route
            path="/chat"
            element={
              <ProtectedRoute>
                <ChatPage />
              </ProtectedRoute>
            }
          />
        </Routes>
      </Router>
    </GoogleOAuthProvider>
  );
};

export default App;
