const CartRoutes = require("express").Router()
const { verifyAll } = require("../middleware/authentication")
const {
    createRecord,
    getRecord,
    getSingleRecord,
    updateRecord,
    deleteRecord
} = require("../controllers/CartController")

CartRoutes.post("/", verifyAll, createRecord)
CartRoutes.get("/user/:_id", verifyAll, getRecord)
CartRoutes.get("/:_id", verifyAll, getSingleRecord)
CartRoutes.put("/:_id", verifyAll, updateRecord)
CartRoutes.delete("/:_id", verifyAll, deleteRecord)

module.exports = CartRoutes