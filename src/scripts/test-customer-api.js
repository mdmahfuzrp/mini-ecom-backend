// Test script to verify customer profile API
const dotenv = require('dotenv');
const path = require('path');
const axios = require('axios');

// Load environment variables
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

// Configuration
const API_URL = 'http://localhost:4000/api';
let authToken = null;

const testCustomerApi = async () => {
    try {
        console.log('=== Testing Customer Profile API ===');

        // Step 1: Login to get token
        console.log('\n1. Logging in to get authentication token...');
        const loginResponse = await axios.post(`${API_URL}/auth/login`, {
            email: 'john@example.com', // Use a user from your seeder data
            password: 'password123',
        });

        authToken = loginResponse.data.token;
        console.log('Login successful, token acquired');

        // Step 2: Try to get customer profile
        console.log('\n2. Fetching customer profile...');
        try {
            const profileResponse = await axios.get(`${API_URL}/customers/profile`, {
                headers: {
                    Authorization: `Bearer ${authToken}`,
                },
            });

            console.log('Customer profile found:');
            console.log(JSON.stringify(profileResponse.data, null, 2));
        } catch (error) {
            if (error.response && error.response.status === 404) {
                console.log('No customer profile found (404), which is expected if not created yet');
            } else {
                console.log('Error fetching profile:', error.response?.data || error.message);
            }
        }

        // Step 3: Create/update customer profile
        console.log('\n3. Creating/updating customer profile...');
        const customerData = {
            firstName: 'John',
            lastName: 'Doe',
            address: '123 Main Street',
            city: 'New York',
            state: 'NY',
            zipCode: '10001',
            country: 'USA',
            phone: '555-123-4567',
        };

        const createResponse = await axios.post(`${API_URL}/customers/profile`, customerData, {
            headers: {
                Authorization: `Bearer ${authToken}`,
            },
        });

        console.log('Profile created/updated successfully:');
        console.log(JSON.stringify(createResponse.data, null, 2));

        // Step 4: Verify profile was created
        console.log('\n4. Verifying profile was created correctly...');
        const verifyResponse = await axios.get(`${API_URL}/customers/profile`, {
            headers: {
                Authorization: `Bearer ${authToken}`,
            },
        });

        console.log('Final customer profile:');
        console.log(JSON.stringify(verifyResponse.data, null, 2));

        console.log('\n=== Customer Profile API Test Completed Successfully ===');
    } catch (error) {
        console.log('Test failed:', error.response?.data || error.message);
    }
};

// Run the test
testCustomerApi();
