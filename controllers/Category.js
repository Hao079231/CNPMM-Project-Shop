const Category = require("../models/Category")
const Product = require("../models/Product")

exports.create = async (req, res) => {
    try {
        // Only admin can create categories (verified by verifyAdmin middleware)
        const { name } = req.body

        // Check if category already exists
        const existingCategory = await Category.findOne({ name: name.trim() })
        if (existingCategory) {
            return res.status(400).json({
                message: "Category already exists"
            })
        }

        const created = new Category({ name: name.trim() })
        await created.save()

        res.status(200).json({ message: 'Create category success' })
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: 'Error adding category, please trying again later' })
    }
}

exports.getAll = async (req, res) => {
    try {
        const result = await Category.find({})
        res.status(200).json({
            message: "Get categories success",
            categories: result,
            total: result.length
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Error fetching categories" })
    }
}

exports.updateById = async (req, res) => {
    try {
        // Only admin can update categories (verified by verifyAdmin middleware)
        const { id } = req.params
        const { name } = req.body

        // Check if category exists
        const existingCategory = await Category.findById(id)
        if (!existingCategory) {
            return res.status(404).json({
                message: "Category not found"
            })
        }

        // Check if new name already exists (excluding current category)
        const duplicateCategory = await Category.findOne({
            name: name.trim(),
            _id: { $ne: id }
        })
        if (duplicateCategory) {
            return res.status(400).json({
                message: "Category name already exists"
            })
        }

        await Category.findByIdAndUpdate(
            id,
            { name: name.trim() },
            { new: true }
        )

        res.status(200).json({ message: 'Update category success' })
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Error updating category, please try again later' })
    }
}

exports.deleteById = async (req, res) => {
    try {
        // Only admin can delete categories (verified by verifyAdmin middleware)
        const { id } = req.params

        // Check if category exists
        const existingCategory = await Category.findById(id)
        if (!existingCategory) {
            return res.status(404).json({
                message: "Category not found"
            })
        }

        // Check if category is being used by any products
        const productsUsingCategory = await Product.find({ category: id })
        if (productsUsingCategory.length > 0) {
            return res.status(400).json({
                message: "Cannot delete category. It is being used by products"
            })
        }

        await Category.findByIdAndDelete(id)

        res.status(200).json({
            message: "Category deleted successfully"
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Error deleting category, please trying again later" })
    }
}