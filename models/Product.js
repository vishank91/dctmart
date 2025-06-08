const mongoose = require("mongoose")

const ProductSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Product Name is Mandatory"]
    },
    maincategory: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Maincategory",
        required: [true, "Maincategory Id is Mendatory"]
    },
    subcategory: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Subcategory",
        required: [true, "Subcategory Id is Mendatory"]
    },
    brand: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Brand",
        required: [true, "Brand Id is Mendatory"]
    },
    color: {
        type: String,
        required: [true, "Product Color is Mandatory"]
    },
    size: {
        type: String,
        required: [true, "Product Size is Mandatory"]
    },
    basePrice: {
        type: Number,
        required: [true, "Product Base Price is Mandatory"]
    },
    discount: {
        type: Number,
        required: [true, "Product Discount is Mandatory"]
    },
    finalPrice: {
        type: Number,
        required: [true, "Product Final Price is Mandatory"]
    },
    stock: {
        type: Boolean,
        default: true
    },
    stockQuantity: {
        type: Number,
        required: [true, "Product Quantity is Mandatory"]
    },
    pic: [],
    description: {
        type: String,
        default: ""
    },
    active: {
        type: Boolean,
        default: true
    }
}, { timestamps: true })

const Product = new mongoose.model("Product", ProductSchema)
module.exports = Product