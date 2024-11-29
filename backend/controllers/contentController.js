const mongoose = require('mongoose');
const Content = require('../models/content'); // Capitalized Content model for consistency

// Create new content
module.exports.createContent = async (req, res, next) => {
  try {
    const { text } = req.body;

    // Validate input
    if (!text) {
      return res.status(400).json({ status: false, msg: 'Content text is required' });
    }

    const newContent = await Content.create({
      content: text,
    });

    res.status(201).json({ status: true, newContent });
  } catch (e) {
    console.error(e);
    next(createHttpError(500, "Failed to create content"));
  }
};

// Fetch all content
module.exports.getAllContent = async (req, res, next) => {
  try {
    const allContent = await Content.find().sort({ updatedAt: -1 });

    if (!allContent.length) {
      return res.status(404).json({ msg: 'No content found' });
    }

    res.status(200).json(allContent);
  } catch (e) {
    console.error(e);
    next(createHttpError(500, "Failed to fetch content"));
  }
};

// Update content
module.exports.updateContent = async (req, res, next) => {
  try {
    const { contentId, content: updatedText, approved } = req.body;

    if (!mongoose.Types.ObjectId.isValid(contentId)) {
      return res.status(400).json({ status: false, msg: 'Invalid content ID' });
    }

    const existingContent = await Content.findById(contentId);
    if (!existingContent) {
      return res.status(404).json({ status: false, msg: 'Content not found' });
    }

    existingContent.content = updatedText || existingContent.content;
    existingContent.approved = approved !== undefined ? approved : existingContent.approved;

    await existingContent.save();
    res.status(200).json({ status: true, updatedContent: existingContent });
  } catch (e) {
    console.error(e);
    next(createHttpError(500, "Failed to update content"));
  }
};

// Delete content
module.exports.deleteContent = async (req, res, next) => {
  try {
    const { contentId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(contentId)) {
      return res.status(400).json({ status: false, msg: 'Invalid content ID' });
    }

    const deletedContent = await Content.findByIdAndDelete(contentId);

    if (!deletedContent) {
      return res.status(404).json({ status: false, msg: 'Content not found' });
    }

    res.status(200).json({ status: true, msg: 'Content deleted successfully' });
  } catch (e) {
    console.error(e);
    next(createHttpError(500, "Failed to delete content"));
  }
};
