const mongoose = require("mongoose")

const NewsletterSchema = new mongoose.Schema({
    email: {
        type: String,
        required: [true, "Email Address is Mandatory"],
        unique: true
    },
    active: {
        type: Boolean,
        default: true
    }
}, { timestamps: true })

const Newsletter = new mongoose.model("Newsletter", NewsletterSchema)
module.exports = Newsletter