// Customer controller

const { Customer, User } = require('../models');

// Get customer profile
const getCustomerProfile = async (req, res) => {
    try {
        const userId = req.user.id;
        console.log('Getting customer profile for user ID:', userId);

        // Add troubleshooting logs
        if (!userId) {
            console.log('User ID is undefined or null');
            return res.status(400).json({
                success: false,
                message: 'User ID is required',
            });
        }

        // Check Customer model
        if (!Customer) {
            console.log('Customer model is not defined properly');
            return res.status(500).json({
                success: false,
                message: 'Internal server error: Model not defined',
            });
        }

        try {
            const customer = await Customer.findOne({
                where: { userId },
                include: [{ model: User, as: 'User', attributes: ['id', 'username', 'email'] }],
            });

            if (!customer) {
                console.log('No customer profile found for user ID:', userId);
                return res.status(404).json({
                    success: false,
                    message: 'Customer profile not found',
                });
            }

            console.log('Customer profile found:', customer.id);
            res.status(200).json({
                success: true,
                customer,
            });
        } catch (queryError) {
            console.log('Database query error:', queryError);
            return res.status(500).json({
                success: false,
                message: 'Database query failed',
                error: queryError.message,
                stack: process.env.NODE_ENV === 'development' ? queryError.stack : undefined,
            });
        }
    } catch (error) {
        console.log('Error getting customer profile:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to get customer profile',
            error: error.message,
            stack: process.env.NODE_ENV === 'development' ? error.stack : undefined,
        });
    }
};

// Create or update customer profile
const createUpdateCustomerProfile = async (req, res) => {
    try {
        const userId = req.user.id;
        const { firstName, lastName, address, city, state, zipCode, country, phone } = req.body;

        // Check if customer profile already exists
        let customer = await Customer.findOne({ where: { userId } });

        if (customer) {
            // Update existing customer profile
            customer = await customer.update({
                firstName,
                lastName,
                address,
                city,
                state,
                zipCode,
                country,
                phone,
            });

            return res.status(200).json({
                success: true,
                message: 'Customer profile updated successfully',
                customer,
            });
        } else {
            // Create new customer profile
            customer = await Customer.create({
                userId,
                firstName,
                lastName,
                address,
                city,
                state,
                zipCode,
                country,
                phone,
            });

            return res.status(201).json({
                success: true,
                message: 'Customer profile created successfully',
                customer,
            });
        }
    } catch (error) {
        console.log('Error creating/updating customer profile:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to create/update customer profile',
            error: error.message,
        });
    }
};

module.exports = {
    getCustomerProfile,
    createUpdateCustomerProfile,
};
