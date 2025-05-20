// OrderItem model
module.exports = (sequelize, DataTypes) => {
    const OrderItem = sequelize.define(
        'OrderItem',
        {
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
            },
            orderId: {
                type: DataTypes.INTEGER,
                allowNull: false,
                references: {
                    model: 'Orders',
                    key: 'id',
                },
            },
            productId: {
                type: DataTypes.INTEGER,
                allowNull: false,
                references: {
                    model: 'Products',
                    key: 'id',
                },
            },
            quantity: {
                type: DataTypes.INTEGER,
                allowNull: false,
                defaultValue: 1,
            },
            price: {
                type: DataTypes.DECIMAL(10, 2),
                allowNull: false,
            },
            subtotal: {
                type: DataTypes.DECIMAL(10, 2),
                allowNull: false,
            },
        },
        {
            timestamps: true,
            indexes: [
                {
                    name: 'order_items_order_idx',
                    using: 'BTREE',
                    fields: ['orderId'],
                },
                {
                    name: 'order_items_product_idx',
                    using: 'BTREE',
                    fields: ['productId'],
                },
            ],
        },
    );

    // Make sure the associations are properly defined in the OrderItem model
    OrderItem.associate = models => {
        OrderItem.belongsTo(models.Order, {
            foreignKey: 'orderId',
            as: 'order',
        });

        OrderItem.belongsTo(models.Product, {
            foreignKey: 'productId',
            as: 'product',
        });
    };

    return OrderItem;
};
