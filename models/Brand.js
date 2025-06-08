const mongoose = require("mongoose")

const BrandSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Brand Name is Mandatory"],
        unique: true
    },
    pic: {
        type: String,
        required: [true, "Brand Pic is Mandatory"]
    },
    active: {
        type: Boolean,
        default: true
    }
}, { timestamps: true })

const Brand = new mongoose.model("Brand", BrandSchema)
module.exports = Brand