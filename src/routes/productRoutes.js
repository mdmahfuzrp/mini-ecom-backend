// Product routes

const express = require('express');
const { body } = require('express-validator');
const { getAllProducts, getProductById, createProduct, updateProduct, deleteProduct } = require('../controllers/productController');
const { authenticate, isAdmin } = require('../middleware/auth');

const router = express.Router();

// Get all products - public
router.get('/', getAllProducts);

// Get product by ID - public
router.get('/:id', getProductById);

// Create product - authenticated user
router.post(
    '/',
    authenticate,
    [
        body('name').notEmpty().withMessage('Product name is required'),
        body('price').isNumeric().withMessage('Price must be a number'),
        body('stock').isInt({ min: 0 }).withMessage('Stock must be a non-negative integer'),
        body('categoryId').isInt().withMessage('Valid category ID is required'),
    ],
    createProduct,
);

// Update product - authenticated user
router.put('/:id', authenticate, updateProduct);

// Delete product - authenticated user
router.delete('/:id', authenticate, deleteProduct);

module.exports = router;
