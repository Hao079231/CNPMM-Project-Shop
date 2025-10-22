const Review = require("../models/Review")

exports.create = async (req, res) => {
    try {
        const userId = req.user._id;
        if (!userId) {
            return res.status(401).json({ message: "Unauthorized: missing user info" });
        }

        const { product, rating, comment } = req.body;

        // Tạo review gắn với user từ token
        const created = new Review({
            user: userId,
            product,
            rating,
            comment
        });

        await created.save();
        const populated = await created.populate({ path: "user", select: "-password" });

        return res.status(200).json({
            message: "Review posted successfully",
            data: populated
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Error posting review, please try again later" });
    }
};


exports.getByProductId = async (req, res) => {
    try {
        const { id } = req.params
        let skip = 0
        let limit = 0

        if (req.query.page && req.query.limit) {
            const pageSize = req.query.limit
            const page = req.query.page

            skip = pageSize * (page - 1)
            limit = pageSize
        }

        const totalDocs = await Review.find({ product: id }).countDocuments().exec()
        const result = await Review.find({ product: id }).skip(skip).limit(limit).populate('user').exec()

        res.set("X-total-Count", totalDocs)
        res.status(200).json(result)

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Error getting reviews for this product, please try again later' })
    }
}

exports.updateById = async (req, res) => {
    try {
        const reviewId = req.params.id;
        const userId = req.user._id;

        if (!userId) {
            return res.status(401).json({ message: "Unauthorized: missing user info" });
        }

        const review = await Review.findById(reviewId);
        if (!review) {
            return res.status(404).json({ message: "Review not found" });
        }

        // Chỉ chủ review mới được update
        if (review.user.toString() !== userId) {
            return res.status(403).json({ message: "Forbidden: you cannot update someone else's review" });
        }

        // Update
        const updated = await Review.findByIdAndUpdate(reviewId, req.body, { new: true })
            .populate({ path: "user", select: "-password" });

        return res.status(200).json({
            message: "Review updated successfully",
            data: updated
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Error updating review, please try again later" });
    }
};

exports.deleteById = async (req, res) => {
    try {
        const reviewId = req.params.id;
        const userId = req.user._id;

        if (!userId) {
            return res.status(401).json({ message: "Unauthorized: missing user info" });
        }

        const review = await Review.findById(reviewId);
        if (!review) {
            return res.status(404).json({ message: "Review not found" });
        }

        // Chỉ chủ review mới được xóa
        if (review.user.toString() !== userId) {
            return res.status(403).json({ message: "Forbidden: you cannot delete someone else's review" });
        }

        await Review.findByIdAndDelete(reviewId);
        return res.status(200).json({ message: "Review deleted successfully" });

    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Error deleting review, please try again later" });
    }
};