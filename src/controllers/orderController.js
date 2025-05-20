// Order controller

const { Order, OrderItem, Product, Customer } = require('../models');
const sequelize = require('../config/database');

// Create new order
const createOrder = async (req, res) => {
    const transaction = await sequelize.transaction();

    try {
        const userId = req.user.id;
        const { items, paymentMethod, customerId } = req.body;

        console.log('Create order request:', { userId, customerId, items, paymentMethod });

        // Validate request data
        if (!customerId) {
            await transaction.rollback();
            return res.status(400).json({
                success: false,
                message: 'Customer ID is required',
            });
        }

        if (!items || !Array.isArray(items) || items.length === 0) {
            await transaction.rollback();
            return res.status(400).json({
                success: false,
                message: 'Order must contain at least one item',
            });
        }

        // Validate customerId
        const customer = await Customer.findOne({
            where: { id: customerId, userId },
        });

        if (!customer) {
            await transaction.rollback();
            return res.status(404).json({
                success: false,
                message: 'Customer not found or does not belong to the current user',
            });
        }

        // Calculate total amount and validate stock
        let totalPrice = 0;
        const orderItems = [];

        for (const item of items) {
            const { productId, quantity } = item;

            // Get product details
            const product = await Product.findByPk(productId);
            if (!product) {
                await transaction.rollback();
                return res.status(404).json({
                    success: false,
                    message: `Product with ID ${productId} not found`,
                });
            }

            // Check stock availability
            if (product.countInStock < quantity) {
                await transaction.rollback();
                return res.status(400).json({
                    success: false,
                    message: `Insufficient stock for product: ${product.name}. Available: ${product.countInStock}, Requested: ${quantity}`,
                });
            }

            // Calculate subtotal
            const subtotal = product.price * quantity;
            totalPrice += subtotal;

            // Add to order items
            orderItems.push({
                productId,
                quantity,
                price: product.price,
                subtotal,
            });

            // Update product stock
            const newStockLevel = product.countInStock - quantity;
            console.log(`Updating stock for product ${product.name} (ID: ${productId}): ${product.countInStock} => ${newStockLevel}`);
            await product.update({ countInStock: newStockLevel }, { transaction });
        }

        // Generate a unique order number (format: ORD-YYYYMMDD-XXXXX)
        const date = new Date();
        const dateStr = date.getFullYear().toString() + (date.getMonth() + 1).toString().padStart(2, '0') + date.getDate().toString().padStart(2, '0');
        const randomStr = Math.floor(10000 + Math.random() * 90000).toString(); // 5-digit random number
        const orderNumber = `ORD-${dateStr}-${randomStr}`;

        // Create order
        const order = await Order.create(
            {
                userId,
                customerId,
                orderNumber,
                totalPrice: totalPrice, // Changed from totalAmount to totalPrice to match the model
                status: 'pending',
                paymentMethod,
                isPaid: false, // Use isPaid from the model instead of paymentStatus
            },
            { transaction },
        );

        // Create order items
        for (const item of orderItems) {
            await OrderItem.create(
                {
                    orderId: order.id,
                    ...item,
                },
                { transaction },
            );
        }

        await transaction.commit();

        res.status(201).json({
            success: true,
            message: 'Order placed successfully',
            order: {
                ...order.toJSON(),
                items: orderItems,
            },
        });
    } catch (error) {
        await transaction.rollback();
        console.log('Error creating order:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to create order',
            error: error.message,
        });
    }
};

// Get all orders for current user
const getUserOrders = async (req, res) => {
    try {
        const userId = req.user.id;

        // First find the customer associated with this user
        const customer = await Customer.findOne({
            where: { userId },
        });

        if (!customer) {
            return res.status(404).json({
                success: false,
                message: 'No customer profile found for this user',
            });
        }

        // Get the orders with their items
        const orders = await Order.findAll({
            where: { customerId: customer.id },
            include: [
                {
                    model: OrderItem,
                    as: 'OrderItems',
                    include: [
                        {
                            model: Product,
                            as: 'product',
                            attributes: ['id', 'name', 'price', 'image'],
                        },
                    ],
                },
            ],
            order: [['createdAt', 'DESC']],
        });

        // Return formatted orders
        return res.json({
            success: true,
            orders: orders.map(order => {
                // Format order items to include product details
                const formattedItems = order.OrderItems
                    ? order.OrderItems.map(item => ({
                          id: item.id,
                          productId: item.productId,
                          productName: item.product ? item.product.name : 'Product',
                          price: item.price,
                          quantity: item.quantity,
                          image: item.product ? item.product.image : null,
                      }))
                    : [];

                return {
                    id: order.id,
                    orderNumber: order.orderNumber,
                    customerId: order.customerId,
                    status: order.status,
                    totalPrice: order.totalPrice,
                    paymentMethod: order.paymentMethod,
                    paymentStatus: order.paymentStatus,
                    createdAt: order.createdAt,
                    updatedAt: order.updatedAt,
                    OrderItems: formattedItems,
                };
            }),
        });
    } catch (error) {
        console.log('Error fetching user orders:', error);
        return res.status(500).json({
            success: false,
            message: 'Error fetching orders',
            error: error.message,
        });
    }
};

// Get order by ID
const getOrderById = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user.id;

        const order = await Order.findOne({
            where: { id, userId },
            include: [
                {
                    model: OrderItem,
                    as: 'items',
                    include: [
                        {
                            model: Product,
                            as: 'product',
                        },
                    ],
                },
                {
                    model: Customer,
                    as: 'customer',
                },
            ],
        });

        if (!order) {
            return res.status(404).json({
                success: false,
                message: 'Order not found',
            });
        }

        res.status(200).json({
            success: true,
            order,
        });
    } catch (error) {
        console.log('Error getting order:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to get order',
            error: error.message,
        });
    }
};

// Cancel order
const cancelOrder = async (req, res) => {
    const transaction = await sequelize.transaction();

    try {
        const { id } = req.params;
        const userId = req.user.id;

        // Find the order
        const order = await Order.findOne({
            where: { id, userId },
            include: [
                {
                    model: OrderItem,
                    as: 'items',
                },
            ],
        });

        if (!order) {
            await transaction.rollback();
            return res.status(404).json({
                success: false,
                message: 'Order not found',
            });
        }

        // Check if order can be cancelled
        if (order.status !== 'pending' && order.status !== 'processing') {
            await transaction.rollback();
            return res.status(400).json({
                success: false,
                message: `Cannot cancel order with status: ${order.status}`,
            });
        }

        // Update order status
        await order.update(
            {
                status: 'cancelled',
                paymentStatus: order.paymentStatus === 'completed' ? 'refunded' : 'cancelled',
            },
            { transaction },
        );

        // Restore product stock
        for (const item of order.items) {
            const product = await Product.findByPk(item.productId);
            if (product) {
                await product.update({ stock: product.stock + item.quantity }, { transaction });
            }
        }

        await transaction.commit();

        res.status(200).json({
            success: true,
            message: 'Order cancelled successfully',
            order,
        });
    } catch (error) {
        await transaction.rollback();
        console.log('Error cancelling order:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to cancel order',
            error: error.message,
        });
    }
};

module.exports = {
    createOrder,
    getUserOrders,
    getOrderById,
    cancelOrder,
};
