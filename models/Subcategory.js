const mongoose = require("mongoose")

const SubcategorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Subcategory Name is Mandatory"],
        unique: true
    },
    pic: {
        type: String,
        required: [true, "Subcategory Pic is Mandatory"]
    },
    active: {
        type: Boolean,
        default: true
    }
}, { timestamps: true })

const Subcategory = new mongoose.model("Subcategory", SubcategorySchema)
module.exports = Subcategory