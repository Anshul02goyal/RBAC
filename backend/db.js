const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI);
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.error(`Error connecting to MongoDB: ${error.message}`);
        // Exit process with failure for critical errors
        process.exit(1);
    }
};

// Event listeners for better monitoring
mongoose.connection.on('connected', () => {
    console.log('Mongoose connected to the database.');
});

mongoose.connection.on('error', (err) => {
    console.error(`Mongoose connection error: ${err.message}`);
});

mongoose.connection.on('disconnected', () => {
    console.warn('Mongoose connection is disconnected.');
});

// Graceful shutdown handling
process.on('SIGINT', async () => {
    await mongoose.connection.close();
    console.log('Mongoose connection closed due to application termination.');
    process.exit(0);
});

module.exports = connectDB;
