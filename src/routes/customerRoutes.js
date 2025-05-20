// Customer routes

const express = require('express');
const { body } = require('express-validator');
const { getCustomerProfile, createUpdateCustomerProfile } = require('../controllers/customerController');
const { authenticate } = require('../middleware/auth');

const router = express.Router();

// Get customer profile - authenticated
router.get('/profile', authenticate, getCustomerProfile);

// Create or update customer profile - authenticated
router.post(
    '/profile',
    authenticate,
    [
        body('firstName').notEmpty().withMessage('First name is required'),
        body('lastName').notEmpty().withMessage('Last name is required'),
        body('address').notEmpty().withMessage('Address is required'),
        body('city').notEmpty().withMessage('City is required'),
        body('state').notEmpty().withMessage('State is required'),
        body('zipCode').notEmpty().withMessage('Zip code is required'),
        body('country').notEmpty().withMessage('Country is required'),
        body('phone').notEmpty().withMessage('Phone number is required'),
    ],
    createUpdateCustomerProfile,
);

module.exports = router;
