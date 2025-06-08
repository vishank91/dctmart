const TestimonialRoutes = require("express").Router()
const { testimonialUploader } = require("../middleware/fileUploader")
const { verifySuperAdmin, verifyAdmins } = require("../middleware/authentication")
const {
    createRecord,
    getRecord,
    getSingleRecord,
    updateRecord,
    deleteRecord
} = require("../controllers/TestimonialController")

TestimonialRoutes.post("/", verifyAdmins, testimonialUploader.single("pic"), createRecord)
TestimonialRoutes.get("/", getRecord)
TestimonialRoutes.get("/:_id", getSingleRecord)
TestimonialRoutes.put("/:_id", verifyAdmins, testimonialUploader.single("pic"), updateRecord)
TestimonialRoutes.delete("/:_id", verifySuperAdmin, deleteRecord)

module.exports = TestimonialRoutes