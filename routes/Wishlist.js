const express = require("express")
const wishlistController = require("../controllers/Wishlist")
const { verifyToken } = require("../middleware/VerifyToken")
const router = express.Router()


router
    .post("/create", verifyToken, wishlistController.create)
    .get("/user", verifyToken, wishlistController.getByUserId)
    .patch("/:id", verifyToken, wishlistController.updateById)
    .delete("/:id", verifyToken, wishlistController.deleteById)

module.exports = router