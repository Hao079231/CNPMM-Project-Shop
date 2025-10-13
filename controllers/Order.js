const Order = require("../models/Order");
const Product = require("../models/Product");

// Helper: compute effective status and timeline based on timestamps
function computeStatusAndTimeline(order) {
    // clone to avoid mutating mongoose doc
    const o = order.toObject ? order.toObject() : { ...order }
    const timeline = []

    timeline.push({ status: 'Pending', at: o.createdAt })

    // auto-confirm after 30 minutes if confirmedAt not set
    const thirtyMinutes = 30 * 60 * 1000
    const created = new Date(o.createdAt)
    let effectiveStatus = o.status || 'Pending'

    if (!o.confirmedAt) {
        const autoConfirmAt = new Date(created.getTime() + thirtyMinutes)
        if (new Date() >= autoConfirmAt) {
            // treat as Confirmed
            effectiveStatus = effectiveStatus === 'Pending' ? 'Confirmed' : effectiveStatus
            timeline.push({ status: 'Confirmed', at: autoConfirmAt })
        }
    } else {
        timeline.push({ status: 'Confirmed', at: o.confirmedAt })
        effectiveStatus = 'Confirmed'
    }

    if (o.preparingAt) {
        timeline.push({ status: 'Preparing', at: o.preparingAt })
        effectiveStatus = 'Preparing'
    }

    if (o.dispatchedAt) {
        timeline.push({ status: 'Out for delivery', at: o.dispatchedAt })
        effectiveStatus = 'Out for delivery'
    }

    if (o.deliveredAt) {
        timeline.push({ status: 'Delivered', at: o.deliveredAt })
        effectiveStatus = 'Delivered'
    }

    if (o.cancellationRequested) {
        timeline.push({ status: 'Cancellation Requested', at: o.cancellationRequestedAt })
        effectiveStatus = 'Cancellation Requested'
    }

    if (o.cancelledAt) {
        timeline.push({ status: 'Cancelled', at: o.cancelledAt })
        effectiveStatus = 'Cancelled'
    }

    return { effectiveStatus, timeline }
}

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
        const orders = await Order.find({ user: id }).sort({ createdAt: -1 })
        // attach computed status and timeline for each
        const results = orders.map(o => {
            const { effectiveStatus, timeline } = computeStatusAndTimeline(o)
            return { ...o.toObject(), effectiveStatus, timeline }
        })
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

// Get single order by id with tracking timeline and effective status
exports.getById = async (req, res) => {
    try {
        const { id } = req.params
        const order = await Order.findById(id)
        if (!order) return res.status(404).json({ message: 'Order not found' })
        const { effectiveStatus, timeline } = computeStatusAndTimeline(order)
        res.status(200).json({ ...order.toObject(), effectiveStatus, timeline })
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: 'Error fetching order, please try again later' })
    }
}

// Cancel order (allowed within 30 minutes of creation). If order is in Preparing step (Preparing or later), set cancellation request flag.
exports.cancelOrder = async (req, res) => {
    try {
        const { id } = req.params
        const order = await Order.findById(id)
        if (!order) return res.status(404).json({ message: 'Order not found' })

        // If already cancelled or delivered
        if (order.cancelledAt) return res.status(400).json({ message: 'Order already cancelled' })
        if (order.deliveredAt) return res.status(400).json({ message: 'Order already delivered' })

        const created = new Date(order.createdAt)
        const now = new Date()
        const thirtyMinutes = 30 * 60 * 1000

        // if still within 30 minutes and not yet in Preparing step, allow cancellation
        if (!order.preparingAt && (now.getTime() - created.getTime()) <= thirtyMinutes) {
            order.status = 'Cancelled'
            order.cancelledAt = now
            await order.save()
            return res.status(200).json({ message: 'Order cancelled successfully' })
        }

        // if in Preparing or later, create a cancellation request flag and notify shop (flag only)
        if (order.preparingAt || order.dispatchedAt) {
            order.cancellationRequested = true
            order.cancellationRequestedAt = now
            order.status = 'Cancellation Requested'
            await order.save()
            return res.status(200).json({ message: 'Cancellation request sent to shop' })
        }

        // Otherwise (beyond 30 minutes but hasn't reached preparing) - deny
        return res.status(400).json({ message: 'Cannot cancel order after 30 minutes of placement' })
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: 'Error cancelling order, please try again later' })
    }
}

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
