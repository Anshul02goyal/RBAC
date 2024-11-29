const express = require('express');
const connectDB = require('./db.js');
require('dotenv').config();
const morgan = require('morgan');
const createHttpError = require('http-errors');
const cors = require('cors');

const authRoutes = require('./routes/auth.js');
const contentRoutes = require('./routes/contentRoutes.js');

// Connect to the database
connectDB();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// Routes
app.use('/auth', authRoutes);
app.use('/content', contentRoutes);

// Handle 404 Not Found errors
app.use((req, res, next) => {
    next(createHttpError(404, 'The requested resource was not found.'));
});

// Global error handler
app.use((error, req, res, next) => {
    const statusCode = error.status || 500;
    res.status(statusCode).json({
        success: false,
        status: statusCode,
        message: error.message || 'Internal Server Error',
    });
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
