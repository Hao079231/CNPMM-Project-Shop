const express = require('express')
const orderController = require("../controllers/Order")
const { verifyToken } = require("../middleware/VerifyToken")
const { verifyAdmin } = require("../middleware/VerifyAdmin")
const router = express.Router()


router
    .post("/create", verifyToken, orderController.create)
    .get("/user", verifyToken, orderController.getByUserId)
    .get("/:id", orderController.getById)
    .post("/cancel", verifyToken, orderController.cancelOrder)
    .get("/", verifyAdmin, orderController.getAll)
    .patch("/:id", verifyAdmin, orderController.updateById)


module.exports = router