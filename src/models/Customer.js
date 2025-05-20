// Customer model
module.exports = (sequelize, DataTypes) => {
    const Customer = sequelize.define(
        'Customer',
        {
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
            },
            userId: {
                type: DataTypes.INTEGER,
                allowNull: false,
                unique: true,
                references: {
                    model: 'Users',
                    key: 'id',
                },
            },
            firstName: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            lastName: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            address: {
                type: DataTypes.TEXT,
                allowNull: false,
            },
            city: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            state: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            zipCode: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            country: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            phone: {
                type: DataTypes.STRING,
                allowNull: false,
            },
        },
        {
            timestamps: true,
        },
    );

    Customer.associate = function (models) {
        // A Customer can have many Orders
        Customer.hasMany(models.Order, {
            foreignKey: 'customerId',
            as: 'orders',
        });

        // A Customer belongs to a User
        Customer.belongsTo(models.User, {
            foreignKey: 'userId',
            as: 'User',
        });
    };

    return Customer;
};
