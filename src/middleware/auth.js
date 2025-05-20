// Authentication middleware

const jwt = require('jsonwebtoken');
const { User } = require('../models');
const dotenv = require('dotenv');
const path = require('path');

// Load environment variables
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

// Middleware to authenticate user using JWT
const authenticate = async (req, res, next) => {
    try {
        // Get token from header or cookies
        const authHeader = req.headers.authorization;
        const token = authHeader && authHeader.startsWith('Bearer ') ? authHeader.split(' ')[1] : req.cookies?.token;

        if (!token) {
            return res.status(401).json({
                success: false,
                message: 'Authentication failed: No token provided',
            });
        }

        // Verify token
        let decoded;
        try {
            decoded = jwt.verify(token, process.env.JWT_SECRET);
        } catch (tokenError) {
            console.log('Token verification error:', tokenError);
            return res.status(401).json({
                success: false,
                message: 'Authentication failed: Invalid or expired token',
            });
        }

        // Find user by id
        const user = await User.findByPk(decoded.id);

        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'Authentication failed: User not found',
            });
        }

        // Add user to request object
        req.user = user;
        next();
    } catch (error) {
        console.log('Authentication error:', error);
        return res.status(500).json({
            success: false,
            message: 'Authentication failed: Server error',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined,
        });
    }
};

// Middleware to check if user is admin
const isAdmin = (req, res, next) => {
    if (req.user && req.user.role === 'admin') {
        next();
    } else {
        return res.status(403).json({
            success: false,
            message: 'Access denied: Admin privileges required',
        });
    }
};

module.exports = {
    authenticate,
    isAdmin,
};
