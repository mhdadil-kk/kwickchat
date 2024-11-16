const { OAuth2Client } = require('google-auth-library');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User');

const client = new OAuth2Client('1093115405015-pcikskk15q5867c27fqcr7ph7bkculr0.apps.googleusercontent.com');  // Replace with your actual Google Client ID

// Register User
const registerUser = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Hash the password before saving
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({ name, email, password: hashedPassword });
    await newUser.save();

    res.status(201).json({ message: 'User registered successfully', user: newUser });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Login User
const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'User not found' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Generate a JWT token
    const token = jwt.sign({ userId: user._id }, 'secretKey', { expiresIn: '1h' });

    res.status(200).json({
      message: 'Login successful',
      token,
      name: user.name,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Google Login
const googleLogin = async (req, res) => {
  const { token } = req.body;

  try {
    // Verify the token with Google's OAuth2 client
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: '1093115405015-pcikskk15q5867c27fqcr7ph7bkculr0.apps.googleusercontent.com', // Replace with your actual Google Client ID
    });

    const payload = ticket.getPayload();

    // Find or create a user in the database
    let user = await User.findOne({ email: payload.email });
    if (!user) {
      user = new User({
        name: payload.name,
        email: payload.email,
        googleId: payload.sub,
      });
      await user.save();
    }

    // Generate a JWT token for the user
    const userToken = jwt.sign({ userId: user._id }, 'secretKey', { expiresIn: '1h' });

    res.status(200).json({
      success: true,
      token: userToken,
    });
  } catch (error) {
    console.error('Google login error:', error);
    res.status(400).json({ success: false, message: 'Google login failed' });
  }
};

module.exports = { registerUser, loginUser, googleLogin };
