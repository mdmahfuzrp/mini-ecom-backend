// Category model

const { DataTypes } = require('sequelize');
// Remove this line: const sequelize = require('../config/database');

module.exports = (sequelize, DataTypes) => {
    const Category = sequelize.define('Category', {
        name: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
        },
        description: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
        image: {
            type: DataTypes.STRING,
            allowNull: true,
        },
    });

    Category.associate = function (models) {
        // A Category can have many Products
        Category.hasMany(models.Product, {
            foreignKey: 'categoryId',
            as: 'products',
        });
    };

    return Category;
};
