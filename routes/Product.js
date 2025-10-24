const express = require('express')
const productController = require("../controllers/Product")
const { verifyAdmin } = require('../middleware/VerifyAdmin')
const router = express.Router()

router
    .get("/", productController.getAll)
    .get("/search", productController.searchProduct)
    .get("/:id", productController.getById)

    // Admin-only routes (require admin privileges)
    .post("/create", verifyAdmin, productController.create)
    .patch("/:id", verifyAdmin, productController.updateById)
    .patch("/undelete/:id", verifyAdmin, productController.undeleteById)
    .delete("/:id", verifyAdmin, productController.deleteById)

module.exports = router