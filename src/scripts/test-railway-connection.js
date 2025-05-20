// Test Railway database connection
const { Sequelize } = require('sequelize');

// Connection parameters from your Railway MySQL URL
const DB_HOST = 'shinkansen.proxy.rlwy.net';
const DB_PORT = 11881;
const DB_NAME = 'railway';
const DB_USER = 'root';
const DB_PASSWORD = 'MXkiHMUeWkWojCWCEuPdoTtVGszxnxAl';

// Create Sequelize instance
const sequelize = new Sequelize(DB_NAME, DB_USER, DB_PASSWORD, {
    host: DB_HOST,
    dialect: 'mysql',
    port: DB_PORT,
    logging: console.log,
    dialectOptions: {
        ssl: {
            require: true,
            rejectUnauthorized: false,
        },
    },
});

// Test the connection
async function testConnection() {
    try {
        await sequelize.authenticate();
        console.log('✅ Connection to Railway MySQL database has been established successfully!');

        // Get all tables to verify further
        const [results] = await sequelize.query('SHOW TABLES');
        console.log('📋 Tables in the database:');
        results.forEach(result => {
            const tableName = Object.values(result)[0];
            console.log(`- ${tableName}`);
        });
    } catch (error) {
        console.error('❌ Unable to connect to the Railway MySQL database:', error);
    } finally {
        // Close the connection
        await sequelize.close();
    }
}

// Run the test
testConnection();
