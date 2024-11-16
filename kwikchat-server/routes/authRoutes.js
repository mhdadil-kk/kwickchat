const express = require('express');
const { registerUser, loginUser, googleLogin } = require('../controllers/authController'); // Import googleLogin
const router = express.Router();

// Register User
router.post('/register', registerUser);

// Login User
router.post('/login', loginUser);

// Google Login
router.post('/google-login', googleLogin); // Add route for Google Login

module.exports = router;
