const WishlistRoutes = require("express").Router()
const { verifyAll } = require("../middleware/authentication")
const {
    createRecord,
    getRecord,
    getSingleRecord,
    deleteRecord
} = require("../controllers/WishlistController")

WishlistRoutes.post("/", verifyAll, createRecord)
WishlistRoutes.get("/user/:_id", verifyAll, getRecord)
WishlistRoutes.get("/:_id", verifyAll, getSingleRecord)
WishlistRoutes.delete("/:_id", verifyAll, deleteRecord)

module.exports = WishlistRoutes