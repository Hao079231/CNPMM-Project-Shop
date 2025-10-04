const express = require("express")
const brandController = require("../controllers/Brand")
const { verifyAdmin } = require('../middleware/VerifyAdmin')
const router = express.Router()

// Public routes (anyone can access)
router
    .get("/", brandController.getAll)

    // Admin-only routes (require admin privileges)
    .post("/", verifyAdmin, brandController.create)
    .patch("/:id", verifyAdmin, brandController.updateById)
    .delete("/:id", verifyAdmin, brandController.deleteById)

module.exports = router