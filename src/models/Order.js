// Order model
module.exports = (sequelize, DataTypes) => {
    const Order = sequelize.define(
        'Order',
        {
            orderNumber: {
                type: DataTypes.STRING,
                allowNull: false,
                unique: true,
            },
            totalPrice: {
                type: DataTypes.DECIMAL(10, 2),
                allowNull: false,
                defaultValue: 0,
            },
            status: {
                type: DataTypes.ENUM('pending', 'processing', 'shipped', 'delivered', 'cancelled'),
                defaultValue: 'pending',
            },
            paymentMethod: {
                type: DataTypes.STRING,
                allowNull: true,
            },
            isPaid: {
                type: DataTypes.BOOLEAN,
                defaultValue: false,
            },
            paidAt: {
                type: DataTypes.DATE,
                allowNull: true,
            },
            isDelivered: {
                type: DataTypes.BOOLEAN,
                defaultValue: false,
            },
            deliveredAt: {
                type: DataTypes.DATE,
                allowNull: true,
            },
            shippingAddress: {
                type: DataTypes.TEXT,
                allowNull: true,
                get() {
                    const value = this.getDataValue('shippingAddress');
                    return value ? JSON.parse(value) : null;
                },
                set(value) {
                    this.setDataValue('shippingAddress', JSON.stringify(value));
                },
            },
        },
        {
            timestamps: true,
        },
    );

    // Make sure the associations are properly defined in the Order model
    Order.associate = models => {
        Order.belongsTo(models.Customer, {
            foreignKey: 'customerId',
            as: 'customer',
        });

        Order.hasMany(models.OrderItem, {
            foreignKey: 'orderId',
            as: 'OrderItems',
        });
    };

    return Order;
};
