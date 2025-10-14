const Address = require("../models/Address")

exports.create = async (req, res) => {
    try {
        // Xác thực token trước khi tạo address
        if (!req.user || !req.user._id) {
            return res.status(401).json({ message: 'Unauthorized' })
        }

        const { street, type } = req.body

        // Nếu type là Home hoặc Business -> kiểm tra trùng
        if (type === 'Home' || type === 'Business') {
            const existing = await Address.findOne({
                user: req.user._id,
                street: street.trim(),
                type: type
            })
            if (existing) {
                return res.status(400).json({
                    message: `Address with type '${type}' and street '${street}' already exists`
                })
            }
        }

        // Tạo mới address
        const created = new Address({
            ...req.body,
            user: req.user._id
        })
        await created.save()

        res.status(200).json({ message: 'Address created successfully' })
    } catch (error) {
        console.error(error)
        res.status(500).json({ message: 'Error adding address, please try again later' })
    }
}


exports.getByUserId = async (req, res) => {
    try {
        // Xác thực token trước khi get address
        if (!req.user || !req.user._id) {
            return res.status(401).json({ message: 'Unauthorized' })
        }
        const id = req.user._id
        const results = await Address.find({ user: id })
        res.status(200).json(results)

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Error fetching addresses, please try again later' })
    }
};

exports.updateById = async (req, res) => {
    try {
        if (!req.user || !req.user._id) {
            return res.status(401).json({ message: 'Unauthorized' })
        }

        const { id } = req.params

        // Không cho phép thay đổi trường user trong body
        if (req.body && req.body.user) delete req.body.user

        // Tìm và cập nhật trong cùng một lần, nhưng chỉ cho phép cập nhật nếu user trùng khớp
        const updated = await Address.findOneAndUpdate(
            { _id: id, user: req.user._id },
            req.body,
            { new: true, runValidators: true }
        )

        if (!updated) {
            return res.status(404).json({ message: 'Address not found or not authorized' })
        }

        res.status(200).json({ message: 'Address updated successfully' })
    } catch (error) {
        console.error(error)
        res.status(500).json({ message: 'Error updating address, please try again later' })
    }
}


exports.deleteById = async (req, res) => {
    try {
        if (!req.user || !req.user._id) {
            return res.status(401).json({ message: 'Unauthorized' })
        }

        const { id } = req.params

        // Xóa và kiểm tra quyền trong cùng một lệnh
        const deleted = await Address.findOneAndDelete({ _id: id, user: req.user._id })

        if (!deleted) {
            return res.status(404).json({ message: 'Address not found or not authorized' })
        }

        res.status(200).json({ message: 'Address deleted successfully' })
    } catch (error) {
        console.error(error)
        res.status(500).json({ message: 'Error deleting address, please try again later' })
    }
}
