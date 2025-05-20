// Database configuration using Sequelize

const { Sequelize } = require('sequelize');
const dotenv = require('dotenv');
const path = require('path');

// Load environment variables from .env file in the root of the backend directory
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

// Create Sequelize instance
const sequelize = new Sequelize(process.env.DB_NAME || 'mini_ecommerce', process.env.DB_USER || 'root', process.env.DB_PASSWORD || '', {
    host: process.env.DB_HOST || 'localhost',
    dialect: 'mysql',
    port: process.env.DB_PORT || 3306,
    logging: process.env.NODE_ENV === 'development' ? console.log : false,
    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000,
    },
    // SSL configuration for production database connections
    ...(process.env.NODE_ENV === 'production' && {
        dialectOptions: {
            ssl: {
                require: true,
                rejectUnauthorized: false,
            },
            // Additional Railway-specific options if needed
        },
    }),
});

// Test database connection
const testConnection = async () => {
    try {
        await sequelize.authenticate();
        console.log('Database connection has been established successfully.');
    } catch (error) {
        console.log('Unable to connect to the database:', error);
    }
};

testConnection();

// Export the Sequelize instance
module.exports = sequelize;

// Also provide config for Sequelize CLI
module.exports.config = {
    development: {
        username: process.env.DB_USER || 'root',
        password: process.env.DB_PASSWORD || '',
        database: process.env.DB_NAME || 'mini_ecommerce_dev',
        host: process.env.DB_HOST || '127.0.0.1',
        dialect: 'mysql',
    },
    test: {
        username: process.env.DB_USER || 'root',
        password: process.env.DB_PASSWORD || '',
        database: process.env.DB_NAME || 'mini_ecommerce_test',
        host: process.env.DB_HOST || '127.0.0.1',
        dialect: 'mysql',
    },
    production: {
        username: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
        host: process.env.DB_HOST,
        dialect: 'mysql',
    },
};
