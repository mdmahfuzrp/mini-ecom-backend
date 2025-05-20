// Product model
module.exports = (sequelize, DataTypes) => {
    const Product = sequelize.define(
        'Product',
        {
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
            },
            name: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            description: {
                type: DataTypes.TEXT,
                allowNull: true,
            },
            price: {
                type: DataTypes.DECIMAL(10, 2),
                allowNull: false,
            },
            image: {
                type: DataTypes.STRING,
                allowNull: true,
            },
            brand: {
                type: DataTypes.STRING,
                allowNull: true,
            },
            countInStock: {
                type: DataTypes.INTEGER,
                allowNull: false,
                defaultValue: 0,
                validate: {
                    min: {
                        args: [0],
                        msg: 'Stock cannot be negative',
                    },
                },
            },
            rating: {
                type: DataTypes.DECIMAL(3, 2),
                allowNull: true,
                defaultValue: 0,
            },
            numReviews: {
                type: DataTypes.INTEGER,
                allowNull: true,
                defaultValue: 0,
            },
            categoryId: {
                type: DataTypes.INTEGER,
                allowNull: false,
                references: {
                    model: 'Categories',
                    key: 'id',
                },
            },
            userId: {
                type: DataTypes.INTEGER,
                allowNull: true,
                references: {
                    model: 'Users',
                    key: 'id',
                },
            },
        },
        {
            timestamps: true,
            indexes: [
                {
                    name: 'products_name_idx',
                    using: 'BTREE',
                    fields: ['name'],
                },
                {
                    name: 'products_price_idx',
                    using: 'BTREE',
                    fields: ['price'],
                },
                {
                    name: 'products_rating_idx',
                    using: 'BTREE',
                    fields: ['rating'],
                },
                {
                    name: 'products_category_idx',
                    using: 'BTREE',
                    fields: ['categoryId'],
                },
            ],
        },
    );

    Product.associate = function (models) {
        // A Product belongs to a Category
        Product.belongsTo(models.Category, {
            foreignKey: 'categoryId',
            as: 'category',
            onDelete: 'CASCADE',
        });

        // A Product belongs to a User (the seller/creator)
        Product.belongsTo(models.User, {
            foreignKey: 'userId',
            as: 'seller',
        });

        // Product can have many OrderItems
        Product.hasMany(models.OrderItem, {
            foreignKey: 'productId',
        });
    };

    return Product;
};
