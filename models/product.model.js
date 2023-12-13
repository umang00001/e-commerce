const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    slug: {
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
    category: {
        type: mongoose.ObjectId,
        ref: "category",
        require: true
    },
    quantity: {
        type: Number,
        required: true
    },
    photo: {
        type: String,
    },
    shipping: {
        type: Boolean
    },
    Qty: {
        type: String
    },
    numOfReviews: {
        type: Number,
        default: 0
    },
    productRating: {
        type: Number,
        default: 0
    },
    reviews: [
        {
            name: {
                type: String,
                require: true
            },
            rating: {
                type: Number,
                require: true
            },
            comment: {
                type: String,
                require: true
            },
            user: {
                type: String,
                require: true
            }
        }
    ]
}, { timestamps: true })

module.exports = mongoose.model("product", productSchema);