// Category controller

const { Category, Product } = require('../models');

// Get all categories
const getAllCategories = async (req, res) => {
    try {
        const categories = await Category.findAll();

        res.status(200).json(categories);
    } catch (error) {
        console.log('Error getting categories:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to get categories',
            error: error.message,
        });
    }
};

// Get category by ID
const getCategoryById = async (req, res) => {
    try {
        const { id } = req.params;

        const category = await Category.findByPk(id, {
            include: [{ model: Product, as: 'products' }],
        });

        if (!category) {
            return res.status(404).json({
                success: false,
                message: 'Category not found',
            });
        }

        res.status(200).json({
            success: true,
            category,
        });
    } catch (error) {
        console.log('Error getting category:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to get category',
            error: error.message,
        });
    }
};

// Create new category
const createCategory = async (req, res) => {
    try {
        const { name, description } = req.body;

        // Check if category already exists
        const existingCategory = await Category.findOne({ where: { name } });
        if (existingCategory) {
            return res.status(400).json({
                success: false,
                message: 'Category with this name already exists',
            });
        }

        // Create category
        const category = await Category.create({ name, description });

        res.status(201).json({
            success: true,
            message: 'Category created successfully',
            category,
        });
    } catch (error) {
        console.log('Error creating category:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to create category',
            error: error.message,
        });
    }
};

// Update category
const updateCategory = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, description } = req.body;

        // Find the category
        const category = await Category.findByPk(id);
        if (!category) {
            return res.status(404).json({
                success: false,
                message: 'Category not found',
            });
        }

        // Check if category name already exists if name is provided
        if (name && name !== category.name) {
            const existingCategory = await Category.findOne({ where: { name } });
            if (existingCategory) {
                return res.status(400).json({
                    success: false,
                    message: 'Category with this name already exists',
                });
            }
        }

        // Update category
        await category.update({
            name: name || category.name,
            description: description || category.description,
        });

        res.status(200).json({
            success: true,
            message: 'Category updated successfully',
            category,
        });
    } catch (error) {
        console.log('Error updating category:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to update category',
            error: error.message,
        });
    }
};

// Delete category
const deleteCategory = async (req, res) => {
    try {
        const { id } = req.params;

        // Find the category
        const category = await Category.findByPk(id);
        if (!category) {
            return res.status(404).json({
                success: false,
                message: 'Category not found',
            });
        }

        // Check if category has products
        const productCount = await Product.count({ where: { categoryId: id } });
        if (productCount > 0) {
            return res.status(400).json({
                success: false,
                message: 'Cannot delete category with associated products',
            });
        }

        // Delete category
        await category.destroy();

        res.status(200).json({
            success: true,
            message: 'Category deleted successfully',
        });
    } catch (error) {
        console.log('Error deleting category:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to delete category',
            error: error.message,
        });
    }
};

module.exports = {
    getAllCategories,
    getCategoryById,
    createCategory,
    updateCategory,
    deleteCategory,
};
