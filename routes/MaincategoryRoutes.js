const MaincategoryRoutes = require("express").Router()
const { maincategoryUploader } = require("../middleware/fileUploader")
const { verifySuperAdmin, verifyAdmins } = require("../middleware/authentication")
const {
    createRecord,
    getRecord,
    getSingleRecord,
    updateRecord,
    deleteRecord
} = require("../controllers/MaincategoryController")

MaincategoryRoutes.post("/",verifyAdmins, maincategoryUploader.single("pic"), createRecord)
MaincategoryRoutes.get("/", getRecord)
MaincategoryRoutes.get("/:_id", getSingleRecord)
MaincategoryRoutes.put("/:_id",verifyAdmins, maincategoryUploader.single("pic"), updateRecord)
MaincategoryRoutes.delete("/:_id",verifySuperAdmin, deleteRecord)

module.exports = MaincategoryRoutes