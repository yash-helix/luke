import { positionModel } from "../../models/PositionSchema.js";

export const addPosition = async (data, res) => {
    const findPositoin = await positionModel.findOne({ ...data })
    if (!findPositoin) {
        const PositoinCreated = await positionModel.create({ ...data })
        return res.status(200).json({ success: true, msg: "Positoin added !!", PositoinCreated })
    }
    else
        return res.status(200).json({ success: false, msg: "Positoin Already Exits", findPositoin })
}

export const getPosition = async (res) => {
    const findPositoin = await positionModel.find({})
    if (!findPositoin)
        return res.status(200).json({ success: false, msg: "No findPositoin Found !!" })
    else
        return res.status(200).json({ success: true, msg: "Positoin", findPositoin })
}

export const deletePositoin = async (id, res) => {
    const findPositoin = await positionModel.findOne({ _id: id })
    if (!findPositoin)
        return res.status(200).json({ success: false, msg: "No Positoin Found !!" })

    else {
        const deletedObj = await positionModel.deleteOne({ _id: id })
        return res.status(200).json({ success: true, msg: "Positoin removed !!", ...deletedObj })
    }
}