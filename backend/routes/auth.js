const express = require('express');
const {
  registerUser,
  loginUser,
  getAllUsers,
  updateUserRole,
  deleteUser,
  getCurrentUser,
  logoutUser
} = require('../controllers/userController');
const authenticate = require('../middlewares/authenticate');
const authorize = require('../middlewares/authorize');
const createHttpError = require('http-errors'); // for better error handling

const router = express.Router();

// Public routes
router.post('/register', async (req, res, next) => {
  try {
    await registerUser(req, res, next);
  } catch (error) {
    next(createHttpError(500, 'Error during user registration.'));
  }
});

router.post('/login', async (req, res, next) => {
  try {
    await loginUser(req, res, next);
  } catch (error) {
    next(createHttpError(500, 'Error during user login.'));
  }
});

router.post('/logout', authenticate, async (req, res, next) => {
  try {
    await logoutUser(req, res, next);
  } catch (error) {
    next(createHttpError(500, 'Error during user logout.'));
  }
});

// Protected routes
router.get('/me', authenticate, async (req, res, next) => {
  try {
    await getCurrentUser(req, res, next);
  } catch (error) {
    next(createHttpError(500, 'Error retrieving current user.'));
  }
});

router.get('/', authenticate, authorize(['Admin', 'Moderator']), async (req, res, next) => {
  try {
    await getAllUsers(req, res, next);
  } catch (error) {
    next(createHttpError(500, 'Error fetching all users.'));
  }
});

router.put('/role', authenticate, authorize(['Admin']), async (req, res, next) => {
  try {
    await updateUserRole(req, res, next);
  } catch (error) {
    next(createHttpError(500, 'Error updating user role.'));
  }
});

router.delete('/:userId', authenticate, authorize(['Admin']), async (req, res, next) => {
  try {
    await deleteUser(req, res, next);
  } catch (error) {
    next(createHttpError(500, 'Error deleting user.'));
  }
});

module.exports = router;
