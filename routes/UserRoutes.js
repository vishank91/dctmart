const UserRoutes = require("express").Router()
const { userUploader } = require("../middleware/fileUploader")
const { verifySuperAdmin, verifyAdmins, verifyAll } = require("../middleware/authentication")
const {
    createRecord,
    getRecord,
    getSingleRecord,
    updateRecord,
    deleteRecord,
    login,
    forgetPasword1,
    forgetPasword2,
    forgetPasword3
} = require("../controllers/UserController")

UserRoutes.post("/", createRecord)
UserRoutes.get("/", verifyAdmins, getRecord)
UserRoutes.get("/:_id", verifyAll, getSingleRecord)
UserRoutes.put("/:_id", verifyAll, userUploader.single("pic"), updateRecord)
UserRoutes.delete("/:_id", verifySuperAdmin, deleteRecord)
UserRoutes.post("/login", login)
UserRoutes.post("/forget-password-1", forgetPasword1)
UserRoutes.post("/forget-password-2", forgetPasword2)
UserRoutes.post("/forget-password-3", forgetPasword3)

module.exports = UserRoutes