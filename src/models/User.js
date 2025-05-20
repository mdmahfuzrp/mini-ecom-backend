// User model

const { DataTypes } = require('sequelize');
const bcrypt = require('bcrypt');
// The sequelize instance will be provided by models/index.js
// Remove this line: const sequelize = require('../config/database');

module.exports = (sequelize, DataTypes) => {
    const User = sequelize.define(
        'User',
        {
            username: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            email: {
                type: DataTypes.STRING,
                allowNull: false,
                unique: true,
                validate: {
                    isEmail: true,
                },
            },
            password: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            role: {
                type: DataTypes.ENUM('admin', 'staff', 'user'), // Add 'user' to the allowed roles
                defaultValue: 'user', // Set default to 'user'
            },
        },
        {
            timestamps: true,
            hooks: {
                beforeCreate: async user => {
                    if (user.password) {
                        try {
                            const salt = await bcrypt.genSalt(10);
                            user.password = await bcrypt.hash(user.password, salt);
                        } catch (error) {
                            console.log('Error hashing password:', error);
                            throw new Error('Error creating user: could not hash password');
                        }
                    }
                },
                beforeUpdate: async user => {
                    if (user.changed('password')) {
                        try {
                            const salt = await bcrypt.genSalt(10);
                            user.password = await bcrypt.hash(user.password, salt);
                        } catch (error) {
                            console.log('Error hashing password:', error);
                            throw new Error('Error updating user: could not hash password');
                        }
                    }
                },
            },
        },
    );

    // Instance method to check password
    User.prototype.checkPassword = async function (password) {
        try {
            return await bcrypt.compare(password, this.password);
        } catch (error) {
            console.log('Password comparison error:', error);
            return false;
        }
    };

    // Define associations
    User.associate = function (models) {
        // A User can have one Customer profile
        User.hasOne(models.Customer, {
            foreignKey: 'userId',
            as: 'Customer',
        });

        // A User can have many Products
        User.hasMany(models.Product, {
            foreignKey: 'userId',
            as: 'products',
        });
    };

    return User;
};
