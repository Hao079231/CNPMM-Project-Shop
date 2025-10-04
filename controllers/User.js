const { json } = require("express")
const User = require("../models/User")
const { sanitizeUser } = require("../utils/SanitizeUser")

exports.getById = async (req, res) => {
    try {
        const { id } = req.params
        const result = (await User.findById(id)).toObject()
        delete result.password
        res.status(200).json(result)

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Error getting your details, please try again later' })
    }
}
exports.updateById = async (req, res) => {
    try {
        const { id } = req.params
        const updated = (await User.findByIdAndUpdate(id, req.body, { new: true }))
        delete updated.password
        res.status(200).json({ message: 'Update profile success' })

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Error getting your details, please try again later' })
    }
}
exports.getAllUser = async (req, res) => {
    try {
        // Only admin can access this endpoint (verified by verifyAdmin middleware)
        const users = await User.find({}).select('-password')

        // Sanitize user data for security
        const sanitizedUsers = users.map(user => sanitizeUser(user))

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