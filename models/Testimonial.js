const mongoose = require("mongoose")

const TestimonialSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Testimonial Name is Mandatory"]
    },
    pic: {
        type: String,
        required: [true, "Testimonial Pic is Mandatory"]
    },
    message: {
        type: String,
        required: [true, "Testimonial Message is Mandatory"]
    },
    active: {
        type: Boolean,
        default: true
    }
}, { timestamps: true })

const Testimonial = new mongoose.model("Testimonial", TestimonialSchema)
module.exports = Testimonial