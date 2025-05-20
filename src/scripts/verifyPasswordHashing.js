// Verify password hashing
const dotenv = require('dotenv');
const path = require('path');
const bcrypt = require('bcrypt');

// Load environment variables
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

// Import sequelize connection and models
const db = require('../models');
const User = db.User;

// Function to check if the stored passwords are hashed
async function verifyPasswordHashing() {
    try {
        console.log('Checking if passwords are properly hashed...');

        // Get the first user
        const users = await User.findAll({ limit: 3 });

        if (users.length === 0) {
            console.log('No users found in the database');
            process.exit(0);
        }

        // Check each user's password format
        users.forEach(user => {
            console.log(`User: ${user.username} (${user.email})`);
            console.log(`Password length: ${user.password.length}`);

            // Bcrypt hashes typically start with $2b$ or $2a$
            const isHashed = user.password.startsWith('$2b$') || user.password.startsWith('$2a$');
            console.log(`Is password hashed: ${isHashed}`);

            if (isHashed) {
                console.log('Password appears to be properly hashed with bcrypt');
            } else {
                console.log('WARNING: Password does not appear to be hashed with bcrypt');
            }

            console.log('-----------------------------------');
        });

        // Verify login works with a test
        const testUser = users[0];
        const plainPassword = 'password123'; // Password from users.json

        const passwordMatches = await bcrypt.compare(plainPassword, testUser.password);
        console.log(`Testing login with original password: ${passwordMatches ? 'SUCCESS' : 'FAILED'}`);

        process.exit(0);
    } catch (error) {
        console.log('Error verifying password hashing:', error);
        process.exit(1);
    }
}

// Run the verification
verifyPasswordHashing();
