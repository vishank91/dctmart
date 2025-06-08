const BrandRoutes = require("express").Router()
const { brandUploader } = require("../middleware/fileUploader")
const { verifySuperAdmin, verifyAdmins } = require("../middleware/authentication")

const {
    createRecord,
    getRecord,
    getSingleRecord,
    updateRecord,
    deleteRecord
} = require("../controllers/BrandController")

BrandRoutes.post("/", verifyAdmins, brandUploader.single("pic"), createRecord)
BrandRoutes.get("/", getRecord)
BrandRoutes.get("/:_id", getSingleRecord)
BrandRoutes.put("/:_id", verifyAdmins, brandUploader.single("pic"), updateRecord)
BrandRoutes.delete("/:_id", verifySuperAdmin, deleteRecord)

module.exports = BrandRoutes