// Database initialization script

const { User, Category, Product, Customer, Order, OrderItem } = require('../models');
const bcrypt = require('bcrypt');
const sequelize = require('../config/database');

const initDb = async () => {
    try {
        // Sync all models with database
        console.log('Syncing database...');
        await sequelize.sync({ force: true });
        console.log('Database synced successfully');

        // Create admin user
        const adminPassword = await bcrypt.hash('admin123', 10);
        const admin = await User.create({
            username: 'admin',
            email: 'admin@example.com',
            password: adminPassword,
            role: 'admin',
        });
        console.log('Admin user created');

        // Create test user
        const userPassword = await bcrypt.hash('user123', 10);
        const user = await User.create({
            username: 'user',
            email: 'user@example.com',
            password: userPassword,
            role: 'user',
        });
        console.log('Test user created');

        // Create customer for test user
        const customer = await Customer.create({
            userId: user.id,
            firstName: 'John',
            lastName: 'Doe',
            address: '123 Main St',
            city: 'New York',
            state: 'NY',
            zipCode: '10001',
            country: 'USA',
            phone: '123-456-7890',
        });
        console.log('Test customer created');

        // Create categories
        const categories = await Category.bulkCreate([
            { name: 'Electronics', description: 'Electronic devices and gadgets' },
            { name: 'Clothing', description: 'Apparel and fashion items' },
            { name: 'Books', description: 'Books and educational materials' },
            { name: 'Home & Kitchen', description: 'Home, kitchen, and furniture items' },
            { name: 'Beauty', description: 'Beauty and personal care products' },
        ]);
        console.log('Categories created');

        // Create products
        const products = await Product.bulkCreate([
            {
                name: 'Smartphone',
                description: 'Latest model with advanced features',
                price: 799.99,
                stock: 50,
                image: 'https://example.com/images/smartphone.jpg',
                rating: 4.5,
                categoryId: categories[0].id,
            },
            {
                name: 'Laptop',
                description: 'High-performance laptop for work and gaming',
                price: 1299.99,
                stock: 30,
                image: 'https://example.com/images/laptop.jpg',
                rating: 4.7,
                categoryId: categories[0].id,
            },
            {
                name: 'T-shirt',
                description: 'Cotton t-shirt, comfortable and stylish',
                price: 19.99,
                stock: 100,
                image: 'https://example.com/images/tshirt.jpg',
                rating: 4.0,
                categoryId: categories[1].id,
            },
            {
                name: 'Jeans',
                description: 'Classic blue jeans, perfect fit',
                price: 49.99,
                stock: 80,
                image: 'https://example.com/images/jeans.jpg',
                rating: 4.2,
                categoryId: categories[1].id,
            },
            {
                name: 'Novel',
                description: 'Bestselling fiction novel',
                price: 14.99,
                stock: 200,
                image: 'https://example.com/images/novel.jpg',
                rating: 4.8,
                categoryId: categories[2].id,
            },
            {
                name: 'Cookbook',
                description: 'Collection of gourmet recipes',
                price: 24.99,
                stock: 60,
                image: 'https://example.com/images/cookbook.jpg',
                rating: 4.3,
                categoryId: categories[2].id,
            },
            {
                name: 'Coffee Maker',
                description: 'Automatic drip coffee maker',
                price: 89.99,
                stock: 40,
                image: 'https://example.com/images/coffeemaker.jpg',
                rating: 4.6,
                categoryId: categories[3].id,
            },
            {
                name: 'Blender',
                description: 'High-speed blender for smoothies and more',
                price: 69.99,
                stock: 35,
                image: 'https://example.com/images/blender.jpg',
                rating: 4.4,
                categoryId: categories[3].id,
            },
            {
                name: 'Face Cream',
                description: 'Hydrating face cream for all skin types',
                price: 29.99,
                stock: 75,
                image: 'https://example.com/images/facecream.jpg',
                rating: 4.1,
                categoryId: categories[4].id,
            },
            {
                name: 'Shampoo',
                description: 'Nourishing shampoo for healthy hair',
                price: 12.99,
                stock: 120,
                image: 'https://example.com/images/shampoo.jpg',
                rating: 3.9,
                categoryId: categories[4].id,
            },
        ]);
        console.log('Products created');

        console.log('Database initialization completed successfully');
    } catch (error) {
        console.log('Database initialization failed:', error);
    }
};

module.exports = initDb;
