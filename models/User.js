const mongoose = require("mongoose")

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Full Name is Mandatory"]
    },
    username: {
        type: String,
        required: [true, "User Name is Mandatory"],
        unique: true
    },
    email: {
        type: String,
        required: [true, "Email Address is Mandatory"],
        unique: true
    },
    phone: {
        type: String,
        required: [true, "Phone Number is Mandatory"]
    },
    password: {
        type: String,
        required: [true, "Password is Mandatory"]
    },
    address: {
        type: String,
        default: ""
    },
    pin: {
        type: String,
        default: ""
    },
    city: {
        type: String,
        default: ""
    },
    state: {
        type: String,
        default: ""
    },
    role: {
        type: String,
        default: "Buyer"
    },
    otp: {
        type: String,
        default: "0987654567890"
    },
    pic: {
        type: String,
        default:""
    },
    active: {
        type: Boolean,
        default: true
    }
}, { timestamps: true })

const User = new mongoose.model("User", UserSchema)
module.exports = User