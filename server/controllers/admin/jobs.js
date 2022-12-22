import { createdTestModel } from "../../models/CreatedTestSchema.js";

export const addJobs = async (data, res) => {
    const findJobs = await createdTestModel.findOne({ ...data })
    if (!findJobs) {
        const jobCreated = await createdTestModel.create({ ...data })
        return res.status(200).json({ success: true, msg: "Job Created !!" })
    }
    else return res.status(200).json({ success: false, msg: "Job Already Exits" })
}

export const getJobs = async (res) => {
    const findJobs = await createdTestModel.find({})
    if (!findJobs)
        return res.status(200).json({ success: false, msg: "No Jobs Found !!" })

    else return res.status(200).json({ success: true, msg: "Jobs", findJobs })
}

export const deleteJob = async (id, res) => {
    const findJobs = await createdTestModel.findOne({ _id: id })
    if (!findJobs)
        return res.status(200).json({ success: false, msg: "No Job Found !!" })

    else {
        const deletedObj = await createdTestModel.deleteOne({ _id: id })

        // if (deletedObj > 0)
        console.log(deletedObj)
        return res.status(200).json({ success: true, msg: "Job removed !!", ...deletedObj })
        // else res.status(400).json({ success: false, msg: "Job Not removed !!", })
    }
}