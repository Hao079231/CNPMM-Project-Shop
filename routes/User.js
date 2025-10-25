const express = require("express")
const userController = require("../controllers/User")
const { verifyAdmin } = require('../middleware/VerifyAdmin')
const { verifyToken } = require("../middleware/VerifyToken")
const router = express.Router()

router
    .get("/profile", verifyToken, userController.getById)
    .patch("/update", verifyToken, userController.updateById)
    .get("/", verifyAdmin, userController.getAllUser)
    .patch("/block", verifyAdmin, userController.blockUser)
    .patch("/unblock", verifyAdmin, userController.unblockUser)


module.exports = router