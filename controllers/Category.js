const Category = require("../models/Category")
const { Schema, default: mongoose } = require("mongoose")

exports.create = async (req, res) => {
    try {
        const created = new Category(req.body)
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
        const { id } = req.params
        const updated = await Category.findByIdAndUpdate(id, req.body, { new: true })
        res.status(200).json({ message: 'Update category success' })
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Error updating category, please try again later' })
    }
}