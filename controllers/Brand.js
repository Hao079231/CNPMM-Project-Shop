const Brand = require("../models/Brand")
const Product = require("../models/Product")

exports.create = async (req, res) => {
    try {
        const { name } = req.body

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

exports.getAll = async (req, res) => {
    try {
        const result = await Brand.find({})
        res.status(200).json(result)
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Error fetching brands" })
    }
}

exports.updateById = async (req, res) => {
    try {
        const { id } = req.params;
        const { name } = req.body;

        // Tìm và kiểm tra trùng tên trong một lệnh duy nhất
        const duplicate = await Brand.findOne({
            name: name.trim(),
            _id: { $ne: id }
        });

        if (duplicate) {
            return res.status(400).json({ message: "Brand name already exists" });
        }

        // Cập nhật brand, nếu không tìm thấy => 404
        const updated = await Brand.findByIdAndUpdate(
            id,
            { name: name.trim() },
            { new: true, runValidators: true }
        );

        if (!updated) {
            return res.status(404).json({ message: "Brand not found" });
        }

        res.status(200).json({ message: "Brand updated successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error updating brand, please try again later" });
    }
};


exports.deleteById = async (req, res) => {
    try {
        const { id } = req.params;

        // Kiểm tra nếu brand đang được dùng
        const used = await Product.exists({ brand: id });
        if (used) {
            return res.status(400).json({
                message: "Cannot delete brand. It is being used by products"
            });
        }

        // Xóa brand, nếu không tìm thấy => 404
        const deleted = await Brand.findByIdAndDelete(id);
        if (!deleted) {
            return res.status(404).json({ message: "Brand not found" });
        }

        res.status(200).json({ message: "Brand deleted successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error deleting brand, please try again later" });
    }
};
