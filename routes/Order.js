const express = require('express')
const orderController = require("../controllers/Order")
const router = express.Router()


router
    .post("/", orderController.create)
    .get("/", orderController.getAll)
    .get("/user/:id", orderController.getByUserId)
    .get("/:id", orderController.getById)
    .patch("/:id", orderController.updateById)
    .post("/:id/cancel", orderController.cancelOrder)


module.exports = router