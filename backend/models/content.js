const mongoose = require("mongoose");

const contentSchema = new mongoose.Schema(
    {
        content: {
            type: String,
            required: [true, "Content is required"],
            trim: true,
            minlength: [5, "Content must be at least 5 characters long"],
            maxlength: [5000, "Content cannot exceed 5000 characters"],
        },
        approved: {
            type: Boolean,
            default: false,
        },
    },
    {
        timestamps: true, // Automatically adds `createdAt` and `updatedAt` fields
    }
);

module.exports = mongoose.model("Content", contentSchema);
