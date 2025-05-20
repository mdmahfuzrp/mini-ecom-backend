// Script to test product stock updates
const { Product } = require('../models');
const sequelize = require('../config/database');

async function testStockUpdate() {
    try {
        // Get a product with stock
        const product = await Product.findOne({
            where: {
                countInStock: {
                    [sequelize.Op.gt]: 0,
                },
            },
        });

        if (!product) {
            console.error('No products with stock found');
            return;
        }

        console.log(`Found product: ${product.name} (ID: ${product.id})`);
        console.log(`Current stock: ${product.countInStock}`);

        // Simulate stock reduction
        const quantityToReduce = 1;
        const newStock = product.countInStock - quantityToReduce;

        console.log(`Reducing stock by ${quantityToReduce}...`);

        // Update the stock
        await product.update({ countInStock: newStock });

        // Verify the update
        const updatedProduct = await Product.findByPk(product.id);
        console.log(`Updated stock: ${updatedProduct.countInStock}`);

        if (updatedProduct.countInStock === newStock) {
            console.log('Stock update successful!');
        } else {
            console.error('Stock update failed!');
        }

        // Restore the original stock for testing purposes
        await product.update({ countInStock: product.countInStock });
        console.log(`Stock restored to: ${product.countInStock}`);
    } catch (error) {
        console.error('Error testing stock update:', error);
    } finally {
        // Close the database connection
        await sequelize.close();
    }
}

// Run the test
testStockUpdate();
