const ContactUsRoutes = require("express").Router()
const { verifySuperAdmin, verifyAdmins } = require("../middleware/authentication")
const {
    createRecord,
    getRecord,
    getSingleRecord,
    updateRecord,
    deleteRecord
} = require("../controllers/ContactUsController")

ContactUsRoutes.post("/", createRecord)
ContactUsRoutes.get("/",verifyAdmins, getRecord)
ContactUsRoutes.get("/:_id",verifyAdmins, getSingleRecord)
ContactUsRoutes.put("/:_id",verifyAdmins, updateRecord)
ContactUsRoutes.delete("/:_id",verifySuperAdmin, deleteRecord)

module.exports = ContactUsRoutes