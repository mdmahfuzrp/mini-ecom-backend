// script to add userId column to Products table

const { sequelize } = require('../models');

async function addUserIdToProducts() {
    try {
        console.log('Starting migration: Adding userId column to Products table...');

        // Check if the column already exists
        const [checkResults] = await sequelize.query(`
            SELECT COLUMN_NAME 
            FROM INFORMATION_SCHEMA.COLUMNS 
            WHERE TABLE_SCHEMA = DATABASE() 
            AND TABLE_NAME = 'Products' 
            AND COLUMN_NAME = 'userId'
        `);

        if (checkResults.length === 0) {
            console.log('userId column does not exist, adding it...');

            // Add the column
            await sequelize.query(`
                ALTER TABLE Products
                ADD COLUMN userId INTEGER
            `);

            // Add the foreign key constraint
            await sequelize.query(`
                ALTER TABLE Products
                ADD CONSTRAINT fk_products_user 
                FOREIGN KEY (userId) 
                REFERENCES Users(id) 
                ON DELETE SET NULL
            `);
        } else {
            console.log('userId column already exists, skipping migration');
        }

        console.log('Migration completed successfully!');
        process.exit(0);
    } catch (error) {
        console.log('Migration failed:', error);
        process.exit(1);
    }
}

// Run the migration
addUserIdToProducts();
