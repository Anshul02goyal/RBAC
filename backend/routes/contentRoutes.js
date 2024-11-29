const express = require('express');
const {
  createContent,
  getAllContent,
  updateContent,
  deleteContent,
} = require('../controllers/contentController');
const authenticate = require('../middlewares/authenticate');
const authorize = require('../middlewares/authorize');
const createHttpError = require('http-errors'); // For improved error handling

const router = express.Router();

// Fetch all content (requires authentication for better security)
router.get('/', authenticate, async (req, res, next) => {
  try {
    await getAllContent(req, res, next);
  } catch (error) {
    next(createHttpError(500, 'Error retrieving content.'));
  }
});

// Create content (any authenticated user can create content)
router.post('/create', authenticate, async (req, res, next) => {
  try {
    await createContent(req, res, next);
  } catch (error) {
    next(createHttpError(500, 'Error creating content.'));
  }
});

// Update content (restricted to Admin and Moderator roles)
router.put('/update', authenticate, authorize(['Admin', 'Moderator']), async (req, res, next) => {
  try {
    // Validate content ID before updating
    if (!req.body.contentId) {
      return next(createHttpError(400, 'Content ID is required.'));
    }
    await updateContent(req, res, next);
  } catch (error) {
    next(createHttpError(500, 'Error updating content.'));
  }
});

// Delete content (restricted to Admin role)
router.delete('/delete/:contentId', authenticate, authorize(['Admin']), async (req, res, next) => {
  try {
    // Validate content ID
    if (!req.params.contentId) {
      return next(createHttpError(400, 'Content ID is required.'));
    }
    await deleteContent(req, res, next);
  } catch (error) {
    next(createHttpError(500, 'Error deleting content.'));
  }
});

module.exports = router;
