const Category = require("../models/Category")
const Product = require("../models/Product")

exports.create = async (req, res) => {
    try {
        const { name } = req.body

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
        res.status(200).json(result)
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Error fetching categories" })
    }
}

exports.updateById = async (req, res) => {
    try {
        const { id } = req.params;
        const { name } = req.body;

        if (!name || !name.trim()) {
            return res.status(400).json({ message: "Category name is required" });
        }

        // Kiểm tra trùng tên (ngoại trừ chính nó)
        const duplicate = await Category.findOne({
            name: name.trim(),
            _id: { $ne: id }
        });

        if (duplicate) {
            return res.status(400).json({ message: "Category name already exists" });
        }

        // Cập nhật trong 1 lệnh — nếu không tìm thấy thì trả 404
        const updated = await Category.findByIdAndUpdate(
            id,
            { name: name.trim() },
            { new: true, runValidators: true }
        );

        if (!updated) {
            return res.status(404).json({ message: "Category not found" });
        }

        res.status(200).json({ message: "Update category success" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error updating category, please try again later" });
    }
};


exports.deleteById = async (req, res) => {
    try {
        const { id } = req.params;

        // Kiểm tra nếu category đang được dùng
        const used = await Product.exists({ category: id });
        if (used) {
            return res.status(400).json({
                message: "Cannot delete category. It is being used by products"
            });
        }

        // Xóa category, nếu không tìm thấy → 404
        const deleted = await Category.findByIdAndDelete(id);
        if (!deleted) {
            return res.status(404).json({ message: "Category not found" });
        }

        res.status(200).json({ message: "Category deleted successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error deleting category, please try again later" });
    }
};
