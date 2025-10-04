const Order = require("../models/Order");
const Product = require("../models/Product");

exports.create = async (req, res) => {
    try {
        const { item, user, address, paymentMode, total } = req.body

        // Validate required fields
        if (!item || !Array.isArray(item) || item.length === 0) {
            return res.status(400).json({
                message: 'Order must contain at least one item'
            })
        }

        if (!user) {
            return res.status(400).json({
                message: 'User ID is required'
            })
        }

        if (!address) {
            return res.status(400).json({
                message: 'Address is required'
            })
        }

        if (!paymentMode) {
            return res.status(400).json({
                message: 'Payment mode is required'
            })
        }

        if (!total || total <= 0) {
            return res.status(400).json({
                message: 'Total amount must be greater than 0'
            })
        }

        // Validate each item in the order
        for (const orderItem of item) {
            if (!orderItem.productId || !orderItem.quantity || orderItem.quantity <= 0) {
                return res.status(400).json({
                    message: 'Each item must have valid productId and quantity'
                })
            }

            // Check if product exists and has enough stock
            const product = await Product.findById(orderItem.productId)
            if (!product) {
                return res.status(404).json({
                    message: `Product with ID ${orderItem.productId} not found`
                })
            }

            if (product.stockQuantity < orderItem.quantity) {
                return res.status(400).json({
                    message: `Insufficient stock for product ${product.title}. Available: ${product.stockQuantity}, Requested: ${orderItem.quantity}`
                })
            }
        }

        // Create the order
        const created = new Order(req.body)
        await created.save()

        // Update saleCount and stockQuantity for each product in the order
        for (const orderItem of item) {
            try {
                // Increment saleCount by the quantity ordered
                await Product.findByIdAndUpdate(
                    orderItem.productId,
                    {
                        $inc: {
                            saleCount: orderItem.quantity,
                            stockQuantity: -orderItem.quantity
                        }
                    }
                )
            } catch (productError) {
                console.log(`Error updating product ${orderItem.productId}:`, productError)
                // Log error but continue with other products
            }
        }

        res.status(200).json({ message: 'Order created successfully' })
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: 'Error creating an order, please trying again later' })
    }
}

exports.getByUserId = async (req, res) => {
    try {
        const { id } = req.params
        const results = await Order.find({ user: id })
        res.status(200).json(results)
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: 'Error fetching orders, please trying again later' })
    }
}

exports.getAll = async (req, res) => {
    try {
        let skip = 0
        let limit = 0

        if (req.query.page && req.query.limit) {
            const pageSize = req.query.limit
            const page = req.query.page
            skip = pageSize * (page - 1)
            limit = pageSize
        }

        const totalDocs = await Order.find({}).countDocuments().exec()
        const results = await Order.find({}).skip(skip).limit(limit).exec()

        res.header("X-Total-Count", totalDocs)
        res.status(200).json(results)

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Error fetching orders, please try again later' })
    }
};

exports.updateById = async (req, res) => {
    try {
        const { id } = req.params
        await Order.findByIdAndUpdate(id, req.body, { new: true })
        res.status(200).json({ message: 'Order updated successfully' })
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Error updating order, please try again later' })
    }
}
