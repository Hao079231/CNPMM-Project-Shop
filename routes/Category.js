const express = require("express")
const categoryController = require("../controllers/Category")
const { verifyAdmin } = require('../middleware/VerifyAdmin')
const router = express.Router()

// Public routes (anyone can access)
router
    .get("/", categoryController.getAll)

    // Admin-only routes (require admin privileges)
    .post("/", verifyAdmin, categoryController.create)
    .patch("/:id", verifyAdmin, categoryController.updateById)
    .delete("/:id", verifyAdmin, categoryController.deleteById)

module.exports = router