const SubcategoryRoutes = require("express").Router()
const { subcategoryUploader } = require("../middleware/fileUploader")
const { verifySuperAdmin, verifyAdmins } = require("../middleware/authentication")
const {
    createRecord,
    getRecord,
    getSingleRecord,
    updateRecord,
    deleteRecord
} = require("../controllers/SubcategoryController")

SubcategoryRoutes.post("/",verifyAdmins, subcategoryUploader.single("pic"), createRecord)
SubcategoryRoutes.get("/", getRecord)
SubcategoryRoutes.get("/:_id", getSingleRecord)
SubcategoryRoutes.put("/:_id",verifyAdmins, subcategoryUploader.single("pic"), updateRecord)
SubcategoryRoutes.delete("/:_id",verifySuperAdmin, deleteRecord)

module.exports = SubcategoryRoutes