const Address = require("../models/Address")

exports.create = async (req, res) => {
    try {
        const created = new Address(req.body)
        await created.save()
        res.status(200).json({ message: 'Address created successfully' })
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: 'Error adding address, please trying again later' })
    }
}

exports.getByUserId = async (req, res) => {
    try {
        const { id } = req.params
        const results = await Address.find({ user: id })
        res.status(200).json(results)

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Error fetching addresses, please try again later' })
    }
};

exports.updateById = async (req, res) => {
    try {
        const { id } = req.params
        await Address.findByIdAndUpdate(id, req.body, { new: true })
        res.status(200).json({ message: 'Address updated successfully' })
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Error updating address, please try again later' })
    }
}

exports.deleteById = async (req, res) => {
    try {
        const { id } = req.params
        await Address.findByIdAndDelete(id)
        res.status(200).json({ message: 'Address deleted successfully' })
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Error deleting address, please try again later' })
    }
}


