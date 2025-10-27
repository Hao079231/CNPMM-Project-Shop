const User = require("../models/User")
const { sanitizeUser } = require("../utils/SanitizeUser")

exports.getById = async (req, res) => {
    try {
        if (!req.user || !req.user._id) {
            return res.status(401).json({ message: 'Unauthorized' })
        }

        const userId = req.user._id
        const user = await User.findById(userId).select('-password')
        if (!user) return res.status(404).json({ message: 'User not found' })

        res.status(200).json({ message: 'Get user success', user })
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Error getting your details, please try again later' })
    }
}
exports.updateById = async (req, res) => {
    try {
        if (!req.user || !req.user._id) {
            return res.status(401).json({ message: 'Unauthorized' })
        }
        const tokenUserId = req.user._id
        if (req.body) {
            if (req.body.password) delete req.body.password
            if (req.body.email) delete req.body.email
            if (typeof req.body.isAdmin !== 'undefined') delete req.body.isAdmin
            if (req.body._id) delete req.body._id
        }

        // Cập nhật user dựa trên id lấy từ token
        const updatedDoc = await User.findByIdAndUpdate(tokenUserId, req.body, { new: true, runValidators: true })
        if (!updatedDoc) return res.status(404).json({ message: 'User not found' })

        res.status(200).json({ message: 'Update success' })

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Error updating your details, please try again later' })
    }
}
exports.getAllUser = async (req, res) => {
    try {
        const users = await User.find({}).select('-password')

        const sanitizedUsers = users.map(user => ({
            ...sanitizeUser(user),
            name: user.name
        }))

        return res.status(200).json({
            message: 'Get list users success',
            users: sanitizedUsers,
            total: sanitizedUsers.length
        })
    } catch (error) {
        console.log(error)
        return res.status(500).json({ message: 'Error fetching users' })
    }
}

exports.blockUser = async (req, res) => {
    try {
        const { userId } = req.body;
        if (!userId) {
            return res.status(400).json({ message: "userId is required" });
        }

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        if (user.isAdmin) {
            return res.status(403).json({ message: "Admin accounts cannot be blocked" });
        }
        user.isVerified = false;
        await user.save();

        return res.status(200).json({ message: "User has been blocked" });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Error blocking user" });
    }
};


exports.unblockUser = async (req, res) => {
    try {
        const { userId } = req.body;
        if (!userId) {
            return res.status(400).json({ message: "userId is required" });
        }

        const updatedUser = await User.findByIdAndUpdate(
            userId,
            { isVerified: true },
            { new: true }
        );

        if (!updatedUser) {
            return res.status(404).json({ message: "User not found" });
        }

        return res.status(200).json({ message: "User has been unblocked" });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Error unblocking user" });
    }
};
