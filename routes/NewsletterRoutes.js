const NewsletterRoutes = require("express").Router()
const { verifySuperAdmin, verifyAdmins } = require("../middleware/authentication")
const {
    createRecord,
    getRecord,
    getSingleRecord,
    updateRecord,
    deleteRecord
} = require("../controllers/NewsletterController")

NewsletterRoutes.post("/", createRecord)
NewsletterRoutes.get("/", verifyAdmins, getRecord)
NewsletterRoutes.get("/:_id", verifyAdmins, getSingleRecord)
NewsletterRoutes.put("/:_id", verifyAdmins, updateRecord)
NewsletterRoutes.delete("/:_id", verifySuperAdmin, deleteRecord)

module.exports = NewsletterRoutes