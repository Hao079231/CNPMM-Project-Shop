const express = require('express')
const orderController = require("../controllers/Order")
const { verifyToken } = require("../middleware/VerifyToken")
const router = express.Router()


router
    .post("/create", verifyToken, orderController.create)
    .get("/", orderController.getAll)
    .get("/user", verifyToken, orderController.getByUserId)
    .get("/:id", orderController.getById)
    .patch("/:id", orderController.updateById)
    .post("/cancel", verifyToken, orderController.cancelOrder)


module.exports = router