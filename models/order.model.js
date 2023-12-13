const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
    products: [
        {
            type: {}
        }
    ],
    payments: {},
    buyers: {
        type: mongoose.ObjectId,
        ref: "user"
    },
    status: {
        type: String,
        default: "Not Procced",
        enum: ["Not Procced", "Processing", "Shipped", "Delivered", "Cancle"]
    }
}, { timestamps: true })

module.exports = mongoose.model("order", orderSchema)