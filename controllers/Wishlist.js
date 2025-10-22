const Wishlist = require("../models/Wishlist")

exports.create = async (req, res) => {
    try {
        const userId = req.user._id;
        const { product, note } = req.body;
        const exist = await Wishlist.findOne({ user: userId, product });
        if (exist) {
            return res.status(400).json({ message: "Product already exists in wishlist" });
        }

        // Tạo wishlist
        const created = new Wishlist({
            user: userId,
            product,
            note
        });

        await created.save();

        // Populate lại để trả dữ liệu đầy đủ
        await created.populate({
            path: "product",
            populate: ["brand"]
        });

        res.status(200).json({ message: "Product added to wishlist successfully" });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Error adding product to wishlist, please try again later" });
    }
};

exports.getByUserId = async (req, res) => {
    try {
        const userId = req.user._id;
        if (!userId) {
            return res.status(401).json({ message: "Unauthorized: missing user info" });
        }

        // Phân trang
        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 0;
        const skip = limit > 0 ? limit * (page - 1) : 0;

        // Lấy danh sách wishlist theo user
        const wishlists = await Wishlist.find({ user: userId })
            .skip(skip)
            .limit(limit)
            .populate({
                path: "product",
                populate: ["brand"]
            })
            .sort({ createdAt: -1 });

        // Đếm tổng wishlist của user
        const totalResults = await Wishlist.countDocuments({ user: userId });

        // Trả response
        res.set("X-Total-Count", totalResults);
        res.status(200).json(wishlists);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Error fetching your wishlist, please try again later" });
    }
};


exports.updateById = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user._id;

        if (!userId) {
            return res.status(401).json({ message: "Unauthorized: missing user info" });
        }

        // Tìm wishlist theo id
        const wishlist = await Wishlist.findById(id);
        if (!wishlist) {
            return res.status(404).json({ message: "Wishlist not found" });
        }

        // Kiểm tra quyền
        if (wishlist.user.toString() !== userId) {
            return res.status(403).json({ message: "Forbidden: you cannot update someone else's wishlist" });
        }

        // Cập nhật wishlist
        const updated = await Wishlist.findByIdAndUpdate(id, req.body, { new: true })
            .populate({ path: "product", populate: ["brand"] });

        res.status(200).json({
            message: 'Wishlist updated successfully',
            data: updated
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Error updating your wishlist, please try again later" });
    }
};

exports.deleteById = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user._id;

        if (!userId) {
            return res.status(401).json({ message: "Unauthorized: missing user info" });
        }

        // Tìm wishlist theo id
        const wishlist = await Wishlist.findById(id);
        if (!wishlist) {
            return res.status(404).json({ message: "Wishlist not found" });
        }

        // Kiểm tra quyền
        if (wishlist.user.toString() !== userId) {
            return res.status(403).json({ message: "Forbidden: you cannot delete someone else's wishlist" });
        }

        // Xóa
        await Wishlist.findByIdAndDelete(id);

        res.status(200).json({
            message: 'Product deleted from wishlist successfully'
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Error deleting that product from wishlist, please try again later" });
    }
};
