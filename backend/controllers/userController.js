const User = require('../models/user'); // Import User model
const bcrypt = require('bcryptjs'); // For password hashing
const jwt = require('jsonwebtoken'); // For authentication
const mongoose = require('mongoose');
require("dotenv").config();

exports.registerUser = async (req, res, next) => {
  try {
    const { username, email, password } = req.body;

    // Check if user already exists by email
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already exists' });
    }

    // Hash password before saving
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const newUser = new User({
      username,
      email,
      password: hashedPassword
    });

    await newUser.save();
    res.status(201).json({ message: 'User registered successfully', newUser });
  } catch (error) {
    console.error(error); // Log the error for debugging
    next(createHttpError(500, "Failed to register user"));
  }
};

exports.loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    // Compare password with hashed password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    // Generate JWT token
    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '3h' });

    return res.status(200).json({ message: 'Login successful', token });
  } catch (error) {
    console.error(error); // Log the error for debugging
    next(createHttpError(500, "Login failed due to server error"));
  }
};

exports.getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find({_id: {$ne: req.user.id}}).select('-password');
    res.status(200).json({ users });
  } catch (error) {
    console.error(error); // Log the error for debugging
    next(createHttpError(500, "Failed to retrieve users"));
  }
};

exports.updateUserRole = async (req, res, next) => {
  try {
    const { userId, role } = req.body;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (!['Admin', 'User', 'Moderator'].includes(role)) {
      return res.status(400).json({ message: 'Invalid role' });
    }

    user.role = role;
    user.updatedAt = new Date();
    await user.save();

    res.status(200).json({ message: 'User role updated successfully', user });
  } catch (error) {
    console.error(error); // Log the error for debugging
    next(createHttpError(500, "Failed to update user role"));
  }
};

exports.deleteUser = async (req, res, next) => {
  try {
    const { userId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: 'Invalid user ID' });
    }

    const user = await User.findByIdAndDelete(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error(error); // Log the error for debugging
    next(createHttpError(500, "Failed to delete user"));
  }
};

exports.getCurrentUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json({ user });
  } catch (error) {
    console.error(error); // Log the error for debugging
    next(createHttpError(500, "Failed to retrieve current user"));
  }
};

exports.logoutUser = async (req, res, next) => {
  try {
    res.status(200).json({ message: "User successfully logged out. Please clear your token on the client side" });
  } catch (error) {
    console.error(error); // Log the error for debugging
    next(createHttpError(500, "Logout failed"));
  }
};
