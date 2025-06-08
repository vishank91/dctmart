const fs = require("fs")
const jwt = require("jsonwebtoken")

const Product = require("../models/Product")
const Newsletter = require("../models/Newsletter")
const mailer = require("../mailer/index")

async function createRecord(req, res) {
    try {
        let data = new Product(req.body)
        if (req.files) {
            data.pic = Array.from(req.files).map(x => x.path)
        }
        await data.save()

        let newsletterData = await Newsletter.find()
        newsletterData.forEach(x => {
            mailer.sendMail({
                from: process.env.MAIL_SENDER,
                to: x.email,
                subject: `Checkout Our Latest Product - ${process.env.SITE_NAME} `,
                html: `
                     <div style="max-width: 600px; margin: auto; background-color: #ffffff; padding: 30px; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
    
                        <h2 style="text-align: center; color: #0066cc; margin-bottom: 20px;">🆕 New Product Listed at ${process.env.SITE_NAME}</h2>
    
                        <p style="margin-bottom: 15px;">We're excited to announce that we’ve added a new product to our ${process.env.SITE_NAME} offerings: <strong>${data.name}</strong>!</p>
    
                        <p style="margin-bottom: 15px;"><strong>${data.name}</strong> is now available</p>
    
                        <div style="background-color: #f1f1f1; padding: 15px; border-left: 4px solid #009688; margin-bottom: 25px;">
                        <p style="margin: 5px 0;"><strong>Product:</strong> ${data.name}</p>
                        </div>
    
                        <div style="text-align: center; margin: 30px 0;">
                        <a href="${process.env.SITE_DOMAIN_FULL}/product/${data._id}" style="padding: 10px 20px; background-color: #009688; color: #ffffff; text-decoration: none; border-radius: 4px; font-weight: bold;">Explore This Product</a>
                        </div>
    
                        <p style="font-size: 14px; color: #555;">Thank you for staying connected with ${process.env.SITE_NAME}. We’re committed to offering you the best product in industry.</p>
    
                        <div style="text-align: center; font-size: 13px; color: #999; margin-top: 30px;">
                        © 2025 ${process.env.SITE_NAME} | <a href="${process.env.SITE_DOMAIN}" style="color: #0066cc; text-decoration: none;">${process.env.SITE_DOMAIN}</a> | contact@${process.env.SITE_EMAIL}
                        </div>
    
                    </div>
                `
            })
        })

        let finalData = await Product.findOne({ _id: data._id })
            .populate("maincategory", ["name"])
            .populate("subcategory", ["name"])
            .populate("brand", ["name"])
        res.send({
            result: "Done",
            data: finalData,
        })
    } catch (error) {
        // console.log(error)

        if (req.files) {
            Array.from(req.files).forEach(x => {
                try {
                    fs.unlinkSync(x.path)
                } catch (error) {
                }
            })
        }

        let errorMessage = {}
        error.errors?.name ? errorMessage.name = error.errors.name.message : null
        error.errors?.maincategory ? errorMessage.maincategory = error.errors.maincategory.message : null
        error.errors?.subcategory ? errorMessage.subcategory = error.errors.subcategory.message : null
        error.errors?.brand ? errorMessage.brand = error.errors.brand.message : null
        error.errors?.color ? errorMessage.color = error.errors.color.message : null
        error.errors?.size ? errorMessage.size = error.errors.size.message : null
        error.errors?.basePrice ? errorMessage.basePrice = error.errors.basePrice.message : null
        error.errors?.discount ? errorMessage.discount = error.errors.discount.message : null
        error.errors?.finalPrice ? errorMessage.finalPrice = error.errors.finalPrice.message : null
        error.errors?.stockQuantity ? errorMessage.stockQuantity = error.errors.stockQuantity.message : null
        error.errors?.pic ? errorMessage.pic = error.errors.pic.message : null

        res.status(Object.values(errorMessage).length ? 400 : 500).send({
            result: "Fail",
            reason: Object.values(errorMessage).length ? errorMessage : "Internal Server Error"
        })
    }
}
async function getRecord(req, res) {
    try {
        let data = await Product.find()
            .populate("maincategory", ["name"])
            .populate("subcategory", ["name"])
            .populate("brand", ["name"])
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
        let data = await Product.findOne({ _id: req.params._id })
            .populate("maincategory", ["name"])
            .populate("subcategory", ["name"])
            .populate("brand", ["name"])
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
        let data = await Product.findOne({ _id: req.params._id })
        if (data) {
            try {
                jwt.verify(token, process.env.JWT_SECRET_KEY_BUYER)
                data.stock = req.body?.stock ?? data.stock
                data.stockQuantity = req.body?.stockQuantity ?? data.stockQuantity
                await data.save()
            }
            catch {
                data.name = req.body?.name ?? data.name
                data.maincategory = req.body?.maincategory ?? data.maincategory
                data.subcategory = req.body?.subcategory ?? data.subcategory
                data.brand = req.body?.brand ?? data.brand
                data.color = req.body?.color ?? data.color
                data.size = req.body?.size ?? data.size
                data.basePrice = req.body?.basePrice ?? data.basePrice
                data.discount = req.body?.discount ?? data.discount
                data.finalPrice = req.body?.finalPrice ?? data.finalPrice
                data.stock = req.body?.stock ?? data.stock
                data.stockQuantity = req.body?.stockQuantity ?? data.stockQuantity
                data.description = req.body?.description ?? data.description
                data.active = req.body?.active ?? data.active

                if (req.body?.oldPics || req.body?.oldPics === "") {
                    if (req.body.oldPics === "") {
                        data.pic.forEach(x => {
                            try {
                                fs.unlinkSync(x)
                            } catch (error) { }
                        })
                    }
                    else {
                        data.pic.forEach(x => {
                            if (!(req.body.oldPics.replaceAll("\\", "").includes(x.replaceAll("\\", "")))) {
                                try {
                                    fs.unlinkSync(x)
                                } catch (error) { }
                            }
                        })
                    }
                    data.pic = req.body.oldPics === "" ? [] : req.body.oldPics.split(",")
                }
                if (await data.save() && req.files) {
                    data.pic = data.pic.concat(Array.from(req.files).map(x => x.path))
                    await data.save()
                }
                let finalData = await Product.findOne({ _id: data._id })
                    .populate("maincategory", ["name"])
                    .populate("subcategory", ["name"])
                    .populate("brand", ["name"])
                res.send({
                    result: "Done",
                    data: finalData,
                })
            }
        }
        else {
            res.status(404).send({
                result: "Fail",
                reason: "Record Not Found"
            })
        }
    } catch (error) {
        console.log(error)
        if (req.files) {
            Array.from(req.files).forEach(x => {
                try {
                    fs.unlinkSync(x.path)
                } catch (error) {
                }
            })
        }
        res.status(500).send({
            result: "Fail",
            reason: "Internal Server Error"
        })
    }
}

async function deleteRecord(req, res) {
    try {
        let data = await Product.findOne({ _id: req.params._id })
        if (data) {
            data.pic.forEach(x => {
                try {
                    fs.unlinkSync(x)
                } catch (error) { }
            })
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