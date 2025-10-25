const express = require('express')
const reviewController = require("../controllers/Review")
const router = express.Router()
const { verifyToken } = require("../middleware/VerifyToken")


router
    .post("/create", verifyToken, reviewController.create)
    .get('/product/:id', reviewController.getByProductId)
    .patch('/:id', verifyToken, reviewController.updateById)
    .delete("/:id", verifyToken, reviewController.deleteById)

module.exports = router