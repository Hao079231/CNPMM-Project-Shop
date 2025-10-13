const mongoose = require("mongoose")
const { Schema } = mongoose

const orderSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    item: {
        type: [Schema.Types.Mixed],
        required: true
    },
    address: {
        type: [Schema.Types.Mixed],
        required: true
    },
    status: {
        type: String,
        enum: ['Pending', 'Confirmed', 'Preparing', 'Out for delivery', 'Delivered', 'Cancelled', 'Cancellation Requested'],
        default: 'Pending'
    },
    paymentMode: {
        type: String,
        enum: ['COD', 'UPI', 'CARD'],
        required: true
    },
    total: {
        type: Number,
        required: true
    },
    // transition timestamps and cancellation flags
    confirmedAt: {
        type: Date
    },
    preparingAt: {
        type: Date
    },
    dispatchedAt: {
        type: Date
    },
    deliveredAt: {
        type: Date
    },
    cancellationRequested: {
        type: Boolean,
        default: false
    },
    cancellationRequestedAt: {
        type: Date
    },
    cancelledAt: {
        type: Date
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
}, { versionKey: false })

module.exports = mongoose.model("Order", orderSchema, "db_order")