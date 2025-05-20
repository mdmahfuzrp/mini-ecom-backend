/**
 * Database initialization script
 * This script will create/reset the database and tables based on Sequelize models
 */

const db = require('../models');
const dotenv = require('dotenv');
const path = require('path');

// Load environment variables
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

// Function to initialize database
async function initializeDatabase() {
    try {
        console.log('Connecting to database...');
        await db.sequelize.authenticate();
        console.log('Database connection established successfully.');

        console.log('Syncing database schema...');
        // Force: true will drop all tables and recreate them
        await db.sequelize.sync({ force: true });
        console.log('Database schema synchronized successfully.');

        console.log('Database initialization complete.');
        process.exit(0);
    } catch (error) {
        console.log('Database initialization failed:', error);
        process.exit(1);
    }
}

// Run the initialization
initializeDatabase();
