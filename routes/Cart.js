const express = require('express')
const cartController = require('../controllers/Cart')
const { verifyToken } = require('../middleware/VerifyToken')
const router = express.Router()

router
    .post("/", verifyToken, cartController.create)
    .get("/user", verifyToken, cartController.getByUserId)
    .patch("/:id", verifyToken, cartController.updateById)
    .delete("/:id", verifyToken, cartController.deleteById)
module.exports = router