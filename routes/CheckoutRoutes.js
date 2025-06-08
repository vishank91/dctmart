const CheckoutRoutes = require("express").Router()
const { verifySuperAdmin, verifyAdmins, verifyAll } = require("../middleware/authentication")
const {
    createRecord,
    getRecord,
    getUserRecord,
    getSingleRecord,
    updateRecord,
    deleteRecord,
    order,
    verifyOrder
} = require("../controllers/CheckoutController")

CheckoutRoutes.post("/", verifyAll, createRecord)
CheckoutRoutes.get("", verifyAdmins, getRecord)
CheckoutRoutes.get("/user/:_id", verifyAll, getUserRecord)
CheckoutRoutes.get("/:_id", verifyAll, getSingleRecord)
CheckoutRoutes.put("/:_id", verifyAdmins, updateRecord)
CheckoutRoutes.delete("/:_id", verifySuperAdmin, deleteRecord)
CheckoutRoutes.post("/order", verifyAll, order)
CheckoutRoutes.post("/verify", verifyAll, verifyOrder)

module.exports = CheckoutRoutes