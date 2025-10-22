const Cart = require('../models/Cart')

// Create new cart item
exports.create = async (req, res) => {
    try {
        // Xác thực user từ token
        if (!req.user || !req.user._id) {
            return res.status(401).json({ message: 'Unauthorized' })
        }

        // Đảm bảo user trong token khớp user trong body (nếu có)
        if (req.body.user && req.body.user !== req.user._id) {
            return res.status(403).json({ message: 'Forbidden: cannot create cart for another user' })
        }

        // Gán user từ token để tránh can thiệp
        const created = new Cart({
            ...req.body,
            user: req.user._id
        })

        await created.populate({ path: "product", populate: { path: "brand" } })
        await created.save()

        res.status(200).json({ message: 'Product added to cart successfully' })
    } catch (error) {
        console.error(error)
        res.status(500).json({ message: 'Error adding product to cart, please try again later' })
    }
}


// Get all cart items by user ID
exports.getByUserId = async (req, res) => {
    try {
        if (!req.user || !req.user._id) {
            return res.status(403).json({ message: 'Unauthorized' })
        }

        const userId = req.user._id

        const result = await Cart.find({ user: userId })
            .populate({ path: "product", populate: { path: "brand" } })

        res.status(200).json(result)
    } catch (error) {
        console.error(error)
        res.status(500).json({ message: 'Error fetching cart items, please try again later' })
    }
}

exports.updateById = async (req, res) => {
    try {
        const { id } = req.params
        const userId = req.user._id;

        // Tìm cart item
        const cartItem = await Cart.findById(id)
        if (!cartItem) {
            return res.status(404).json({ message: 'Cart item not found' })
        }

        // Chỉ chủ sở hữu mới được update
        if (cartItem.user.toString() !== userId.toString()) {
            return res.status(403).json({ message: 'Forbidden: cannot update another user’s cart' })
        }

        // Không cho phép thay đổi trường user
        if (req.body && req.body.user) delete req.body.user

        await Cart.findByIdAndUpdate(id, req.body, { new: true, runValidators: true })
        res.status(200).json({ message: 'Cart item updated successfully' })
    } catch (error) {
        console.error(error)
        res.status(500).json({ message: 'Error updating cart items, please try again later' })
    }
}


// Delete a cart item
exports.deleteById = async (req, res) => {
    try {
        const { id } = req.params
        const userId = req.user._id;

        // Tìm cart item
        const cartItem = await Cart.findById(id)
        if (!cartItem) {
            return res.status(404).json({ message: 'Cart item not found' })
        }

        // Chỉ chủ sở hữu mới được xóa
        if (cartItem.user.toString() !== userId.toString()) {
            return res.status(403).json({ message: 'Forbidden: cannot delete another user’s cart' })
        }

        await Cart.findByIdAndDelete(id)
        res.status(200).json({ message: 'Cart item deleted successfully' })
    } catch (error) {
        console.error(error)
        res.status(500).json({ message: 'Error deleting cart item, please try again later' })
    }
}