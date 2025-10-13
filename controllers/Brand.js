const Brand = require("../models/Brand")
const Product = require("../models/Product")

exports.create = async (req, res) => {
    try {
        // Only admin can create brands (verified by verifyAdmin middleware)
        const { name } = req.body

        // Check if brand already exists
        const existingBrand = await Brand.findOne({ name: name.trim() })
        if (existingBrand) {
            return res.status(400).json({
                message: "Brand already exists"
            })
        }

        const created = await new Brand({ name: name.trim() })
        await created.save()

        res.status(200).json({ message: "Brand created successfully" })
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Error adding brand, please trying again later" })
    }
}

// exports.getAll = async (req, res) => {
//     try {
//         const result = await Brand.find({})
//         res.status(200).json({
//             message: "Get brands success",
//             brands: result,
//             total: result.length
//         })
//     } catch (error) {
//         console.log(error);
//         res.status(500).json({ message: "Error fetching brands" })
//     }
// }

exports.getAll=async(req,res)=>{
    try {
        const result=await Brand.find({})
        res.status(200).json(result)
    } catch (error) {
        console.log(error);
        res.status(500).json({message:"Error fetching brands"})
    }
}

exports.updateById = async (req, res) => {
    try {
        // Only admin can update brands (verified by verifyAdmin middleware)
        const { id } = req.params
        const { name } = req.body

        // Check if brand exists
        const existingBrand = await Brand.findById(id)
        if (!existingBrand) {
            return res.status(404).json({
                message: "Brand not found"
            })
        }

        // Check if new name already exists (excluding current brand)
        const duplicateBrand = await Brand.findOne({
            name: name.trim(),
            _id: { $ne: id }
        })
        if (duplicateBrand) {
            return res.status(400).json({
                message: "Brand name already exists"
            })
        }

        await Brand.findByIdAndUpdate(
            id,
            { name: name.trim() },
            { new: true }
        )

        res.status(200).json({ message: "Brand updated successfully" })
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Error updating brand, please trying again later" })
    }
}

exports.deleteById = async (req, res) => {
    try {
        // Only admin can delete brands (verified by verifyAdmin middleware)
        const { id } = req.params

        // Check if brand exists
        const existingBrand = await Brand.findById(id)
        if (!existingBrand) {
            return res.status(404).json({
                message: "Brand not found"
            })
        }

        // TODO: Check if brand is being used by any products
        const productsUsingBrand = await Product.find({ brand: id })
        if (productsUsingBrand.length > 0) {
            return res.status(400).json({
                message: "Cannot delete brand. It is being used by products"
            })
        }

        await Brand.findByIdAndDelete(id)

        res.status(200).json({ message: "Brand deleted successfully" })
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Error deleting brand, please trying again later" })
    }
}