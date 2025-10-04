const mongoose = require("mongoose")
const { Schema } = mongoose

const productSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    discountPercentage: {
        type: Number,
        default: 0,
    },
    category: {
        type: Schema.Types.ObjectId,
        ref: "Category",
        required: true
    },
    brand: {
        type: Schema.Types.ObjectId,
        ref: "Brand",
        required: true
    },
    stockQuantity: {
        type: Number,
        required: true
    },
    thumbnail: {
        type: String,
        required: true
    },
    images: {
        type: [String],
        required: true
    },
    viewCount: {
        type: Number,
        default: 0
    },
    saleCount: {
        type: Number,
        default: 0
    },
    isDeleted: {
        type: Boolean,
        default: false
    }
}, { timestamps: true, versionKey: false })

module.exports = mongoose.model('Product', productSchema, 'db_product')