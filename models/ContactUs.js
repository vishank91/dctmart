const mongoose = require("mongoose")

const ContactUsSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Name is Mandatory"]
    },
    email: {
        type: String,
        required: [true, "Email Address is Mandatory"]
    },
    phone: {
        type: String,
        required: [true, "Phone Number is Mandatory"]
    },
    subject: {
        type: String,
        required: [true, "Subject is Mandatory"]
    },
    message: {
        type: String,
        required: [true, "Message is Mandatory"]
    },
    active: {
        type: Boolean,
        default: true
    }
}, { timestamps: true })

const ContactUs = new mongoose.model("ContactUs", ContactUsSchema)
module.exports = ContactUs