const Subcategory = require("../models/Subcategory")
const fs = require("fs")
async function createRecord(req, res) {
    try {
        let data = new Subcategory(req.body)
        if (req.file) {
            data.pic = req.file.path
        }
        await data.save()
        res.send({
            result: "Done",
            data: data
        })
    } catch (error) {
        // console.log(error)

        if (req.file) {
            try {
                fs.unlinkSync(req.file.path)
            } catch (error) {
            }
        }

        let errorMessage = {}
        error.keyValue ? errorMessage.name = "Subcategory Name is Already Exist" : null
        error.errors?.name ? errorMessage.name = error.errors.name.message : null
        error.errors?.pic ? errorMessage.pic = error.errors.pic.message : null

        res.status(Object.values(errorMessage).length ? 400 : 500).send({
            result: "Fail",
            reason: Object.values(errorMessage).length ? errorMessage : "Internal Server Error"
        })
    }
}
async function getRecord(req, res) {
    try {
        let data = await Subcategory.find().sort({ _id: -1 })
        res.send({
            result: "Done",
            data: data
        })
    } catch (error) {
        console.log(error)
        res.status(500).send({
            result: "Fail",
            reason: "Internal Server error"
        })
    }
}
async function getSingleRecord(req, res) {
    try {
        let data = await Subcategory.findOne({ _id: req.params._id })
        if (data) {
            res.send({
                result: "Done",
                data: data
            })
        }
        else {
            res.status(404).send({
                result: "Fail",
                reason: "Record Not Found"
            })
        }
    } catch (error) {
        console.log(error)
        res.status(500).send({
            result: "Fail",
            reason: "Internal Server error"
        })
    }
}

async function updateRecord(req, res) {
    try {
        let data = await Subcategory.findOne({ _id: req.params._id })
        if (data) {
            data.name = req.body?.name ?? data.name
            data.active = req.body?.active ?? data.active
            if (await data.save() && req.file) {
                try {
                    fs.unlinkSync(data.pic)
                } catch (error) { }
                data.pic = req.file.path
                await data.save()
            }
            res.send({
                result: "Done",
                data: data
            })
        }
        else {
            res.status(404).send({
                result: "Fail",
                reason: "Record Not Found"
            })
        }
    } catch (error) {
        // console.log(error)
        if (req.file) {
            try {
                fs.unlinkSync(req.file.path)
            } catch (error) { }
        }

        let errorMessage = {}
        error.keyValue ? errorMessage.name = "Subcategory Name is Already Exist" : null

        res.status(Object.values(errorMessage).length ? 400 : 500).send({
            result: "Fail",
            reason: Object.values(errorMessage).length ? errorMessage : "Internal Server Error"
        })
    }
}

async function deleteRecord(req, res) {
    try {
        let data = await Subcategory.findOne({ _id: req.params._id })
        if (data) {
            try {
                fs.unlinkSync(data.pic)
            } catch (error) { }
            await data.deleteOne()
            res.send({
                result: "Done"
            })
        }
        else {
            res.status(404).send({
                result: "Fail",
                reason: "Record Not Found"
            })
        }
    } catch (error) {
        console.log(error)
        res.status(500).send({
            result: "Fail",
            reason: "Internal Server error"
        })
    }
}

module.exports = {
    createRecord: createRecord,
    getRecord: getRecord,
    getSingleRecord: getSingleRecord,
    updateRecord: updateRecord,
    deleteRecord:deleteRecord
}