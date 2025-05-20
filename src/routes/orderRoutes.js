// Order routes

const express = require('express');
const { body } = require('express-validator');
const { createOrder, getUserOrders, getOrderById, cancelOrder } = require('../controllers/orderController');
const { authenticate } = require('../middleware/auth');

const router = express.Router();

// Create order - authenticated
router.post(
    '/',
    authenticate,
    [
        body('items').isArray().withMessage('Items must be an array'),
        body('items.*.productId').isInt().withMessage('Product ID must be an integer'),
        body('items.*.quantity').isInt({ min: 1 }).withMessage('Quantity must be at least 1'),
        body('paymentMethod').notEmpty().withMessage('Payment method is required'),
        body('customerId').isInt().withMessage('Customer ID is required'),
    ],
    createOrder,
);

// Get all orders for current user - authenticated
router.get('/', authenticate, getUserOrders);

// Get order by ID - authenticated
router.get('/:id', authenticate, getOrderById);

// Cancel order - authenticated
router.put('/:id/cancel', authenticate, cancelOrder);

module.exports = router;
