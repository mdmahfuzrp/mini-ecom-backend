// server.js - Main entry point for the Mini E-Commerce API
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const dotenv = require('dotenv');
const path = require('path');

// Load environment variables
dotenv.config({ path: path.resolve(__dirname, '../.env') });

// Initialize express app
const app = express();

// Import configs
const corsOptions = require('./config/cors');

// Middleware
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(morgan('dev'));

// Import routes
const productRoutes = require('./routes/productRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const authRoutes = require('./routes/authRoutes');
const orderRoutes = require('./routes/orderRoutes');
const customerRoutes = require('./routes/customerRoutes');

// Import error handler
const errorHandler = require('./middleware/errorHandler');

// Mount routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/customers', customerRoutes);

// Root route
app.get('/', (req, res) => {
    res.json({ message: 'Welcome to Mini E-Commerce API' });
});

// Error handling middleware (place this after all routes)
app.use(errorHandler);

// Development-only routes
if (process.env.NODE_ENV === 'development') {
    app.get('/api/seed', async (req, res) => {
        try {
            const seeder = require('./seeders/seeder');
            res.json({ message: 'Database seeded!' });
        } catch (error) {
            res.status(500).json({ message: 'Error seeding database', error: error.message });
        }
    });
}

// Start server
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

module.exports = app;
