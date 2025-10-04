const express = require("express")
const userController = require("../controllers/User")
const { verifyAdmin } = require('../middleware/VerifyAdmin')
const router = express.Router()

router
    .get("/:id", userController.getById)
    .patch("/:id", userController.updateById)
    .get("/", verifyAdmin, userController.getAllUser)

module.exports = router