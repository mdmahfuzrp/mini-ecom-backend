// Category routes

const express = require('express');
const { body } = require('express-validator');
const { getAllCategories, getCategoryById, createCategory, updateCategory, deleteCategory } = require('../controllers/categoryController');
const { authenticate, isAdmin } = require('../middleware/auth');

const router = express.Router();

// Get all categories - public
router.get('/', getAllCategories);

// Get category by ID - public
router.get('/:id', getCategoryById);

// Create category - admin only
router.post('/', authenticate, isAdmin, [body('name').notEmpty().withMessage('Category name is required')], createCategory);

// Update category - admin only
router.put('/:id', authenticate, isAdmin, updateCategory);

// Delete category - admin only
router.delete('/:id', authenticate, isAdmin, deleteCategory);

module.exports = router;
