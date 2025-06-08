const ProductRoutes = require("express").Router()
const { productUploader } = require("../middleware/fileUploader")
const { verifySuperAdmin, verifyAdmins, verifyAll } = require("../middleware/authentication")
const {
    createRecord,
    getRecord,
    getSingleRecord,
    updateRecord,
    deleteRecord
} = require("../controllers/ProductController")

ProductRoutes.post("/", verifyAdmins, productUploader.array("pic"), createRecord)
ProductRoutes.get("/", getRecord)
ProductRoutes.get("/:_id", getSingleRecord)
ProductRoutes.put("/:_id", verifyAll, productUploader.array("pic"), updateRecord)
ProductRoutes.delete("/:_id", verifySuperAdmin, deleteRecord)

module.exports = ProductRoutes