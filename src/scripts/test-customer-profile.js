// Test script for getting customer profile
const axios = require('axios');
const dotenv = require('dotenv');
const path = require('path');

// Load environment variables
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

// Function to log in and get token
async function login() {
    try {
        const response = await axios.post('http://localhost:4000/api/auth/login', {
            email: 'john@example.com', // Use an existing user from your database
            password: 'password123', // Use the correct password
        });

        return response.data.token;
    } catch (error) {
        console.log('Login failed:', error.response?.data || error.message);
        return null;
    }
}

// Function to get customer profile
async function getCustomerProfile(token) {
    try {
        const response = await axios.get('http://localhost:4000/api/customers/profile', {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        console.log('Customer profile retrieved successfully:');
        console.log(JSON.stringify(response.data, null, 2));
        return response.data;
    } catch (error) {
        console.log('Failed to get customer profile:', error.response?.data || error.message);
        return null;
    }
}

// Main function
async function main() {
    const token = await login();

    if (!token) {
        console.log('Test failed: Could not obtain authentication token');
        return;
    }

    console.log('Authentication successful, token obtained');

    const customerProfile = await getCustomerProfile(token);

    if (!customerProfile) {
        console.log('Test failed: Could not retrieve customer profile');
        return;
    }

    console.log('Test passed: Customer profile retrieved successfully');
}

// Run the test
main().catch(error => {
    console.log('Uncaught error:', error);
});
