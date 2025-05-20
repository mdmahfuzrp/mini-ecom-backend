const dotenv = require('dotenv');
const path = require('path');
const fs = require('fs');

// Load environment variables
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

// Import sequelize connection
const db = require('../models');

// Load models
const Product = db.Product;
const Category = db.Category;
const User = db.User;
const Order = db.Order;
const Customer = db.Customer;

// Read JSON files
const products = JSON.parse(fs.readFileSync(path.join(__dirname, 'data', 'products.json'), 'utf-8'));
const categories = JSON.parse(fs.readFileSync(path.join(__dirname, 'data', 'categories.json'), 'utf-8'));
const users = JSON.parse(fs.readFileSync(path.join(__dirname, 'data', 'users.json'), 'utf-8'));
const customers = JSON.parse(fs.readFileSync(path.join(__dirname, 'data', 'customers.json'), 'utf-8'));

// Import data into DB
const importData = async () => {
    try {
        // Sync database with force option
        await db.sequelize.sync({ force: true });
        console.log('Database synchronized');

        // Create records in the correct order to handle foreign key constraints
        const createdCategories = await Category.bulkCreate(categories);
        console.log('Categories imported');

        // Create users first - include hooks to ensure passwords are hashed
        const createdUsers = await User.bulkCreate(users, { individualHooks: true });
        console.log('Users imported');

        // Get only non-admin users for product assignment
        const regularUsers = createdUsers.filter(user => user.role !== 'admin');

        // Map user IDs to customers if they reference existing users
        // No need to transform customer data since it now matches the model
        await Customer.bulkCreate(customers);
        console.log('Customers imported'); // Map category IDs for products if needed
        const productsWithMappedCategories = products.map((product, index) => {
            // Find the category by name
            const category = createdCategories.find(c => c.name === product.category);

            // Assign products to regular users in a round-robin fashion
            const userId = regularUsers[index % regularUsers.length].id;

            console.log(`Assigning product "${product.name}" to user ID: ${userId}`);

            return {
                ...product,
                categoryId: category ? category.id : null,
                userId: userId, // Associate each product with a user
            };
        });

        await Product.bulkCreate(productsWithMappedCategories);
        console.log('Products imported');

        console.log('Data imported!');
        process.exit();
    } catch (error) {
        console.log(`${error}`);
        process.exit(1);
    }
};

// Delete data from DB
const destroyData = async () => {
    try {
        // Use Sequelize's truncate option to efficiently clear tables
        await Product.destroy({ truncate: { cascade: true } });
        await Customer.destroy({ truncate: { cascade: true } });
        await User.destroy({ truncate: { cascade: true } });
        await Order.destroy({ truncate: { cascade: true } });
        await Category.destroy({ truncate: { cascade: true } });

        console.log('Data destroyed!');
        process.exit();
    } catch (error) {
        console.log(`${error}`);
        process.exit(1);
    }
};

// Check command line args to determine what to do
if (process.argv[2] === '-d') {
    destroyData();
} else {
    importData();
}
