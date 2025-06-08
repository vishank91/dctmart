const Cart = require("../models/Cart")
async function createRecord(req, res) {
    try {
        let data = new Cart(req.body)
        await data.save()

        let finalData = await Cart.findOne({ _id: data._id })
            .populate("user", ["-_id", "username"])
            .populate({
                path: "product",
                select: "name brand color size finalPrice stockQuantity stock pic",
                populate: {
                    path: "brand",
                    select: "-_id name"
                },
                options: {
                    slice: {
                        pic: 1
                    }
                }
            })
        res.send({
            result: "Done",
            data: finalData,
        })
    } catch (error) {
        // console.log(error)
        let errorMessage = {}
        error.errors?.user ? errorMessage.user = error.errors.user.message : null
        error.errors?.product ? errorMessage.product = error.errors.product.message : null
        error.errors?.qty ? errorMessage.qty = error.errors.qty.message : null
        error.errors?.total ? errorMessage.total = error.errors.total.message : null

        res.status(Object.values(errorMessage).length ? 400 : 500).send({
            result: "Fail",
            reason: Object.values(errorMessage).length ? errorMessage : "Internal Server Error"
        })
    }
}
async function getRecord(req, res) {
    try {
        let data = await Cart.find({user:req.params._id})
            .populate("user", ["-_id", "username"])
            .populate({
                path: "product",
                select: "name brand color size finalPrice stockQuantity stock pic",
                populate: {
                    path: "brand",
                    select: "-_id name"
                },
                options: {
                    slice: {
                        pic: 1
                    }
                }
            })
            .sort({ _id: -1 })

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
        let data = await Cart.findOne({ _id: req.params._id })
            .populate("user", ["-_id", "username"])
            .populate({
                path: "product",
                select: "name brand color size finalPrice stockQuantity stock pic",
                populate: {
                    path: "brand",
                    select: "-_id name"
                },
                options: {
                    slice: {
                        pic: 1
                    }
                }
            })
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
        let data = await Cart.findOne({ _id: req.params._id })
        if (data) {
            data.qty = req.body?.qty ?? data.qty
            data.total = req.body?.total ?? data.total
            await data.save()

            let finalData = await Cart.findOne({ _id: data._id })
                .populate("user", ["-_id", "username"])
                .populate({
                    path: "product",
                    select: "name brand color size finalPrice stockQuantity stock pic",
                    populate: {
                        path: "brand",
                        select: "-_id name"
                    },
                    options: {
                        slice: {
                            pic: 1
                        }
                    }
                })
            res.send({
                result: "Done",
                data: finalData,
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
        res.status(500).send({
            result: "Fail",
            reason: "Internal Server Error"
        })
    }
}

async function deleteRecord(req, res) {
    try {
        let data = await Cart.findOne({ _id: req.params._id })
        if (data) {
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
    deleteRecord: deleteRecord
}