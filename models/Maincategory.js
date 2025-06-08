const mongoose = require("mongoose")

const MaincategorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Maincategory Name is Mandatory"],
        unique: true
    },
    pic: {
        type: String,
        required: [true, "Maincategory Pic is Mandatory"]
    },
    active: {
        type: Boolean,
        default: true
    }
}, { timestamps: true })

const Maincategory = new mongoose.model("Maincategory", MaincategorySchema)
module.exports = Maincategory