const Newsletter = require("../models/Newsletter")
const mailer = require("../mailer/index")
async function createRecord(req, res) {
    try {
        let data = new Newsletter(req.body)
        await data.save()

        mailer.sendMail({
            from: process.env.MAIL_SENDER,
            to: data.email,
            subject: `Thank You for Subscribing - ${process.env.SITE_NAME} Newsletter `,
            html: `
                 <div style="max-width: 600px; margin: auto; background-color: #ffffff; padding: 30px; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">

                <h2 style="text-align: center; color: #009688; margin-bottom: 20px;">🎉 Welcome to the ${process.env.SITE_NAME} Newsletter!</h2>

                <p style="margin-bottom: 15px;">Thank you for subscribing to <strong>${process.env.SITE_NAME} Newsletter</strong>! We’re thrilled to have you as part of our Ecomm community.</p>

                <p style="margin-bottom: 20px;">We promise to send only helpful and relevant content — no spam, ever!</p>

                <div style="text-align: center; margin: 30px 0;">
                <a href="${process.env.SITE_DOMAIN_FULL}" style="padding: 10px 20px; background-color: #009688; color: #ffffff; text-decoration: none; border-radius: 4px; font-weight: bold;">Visit Our Website</a>
                </div>

                <p style="font-size: 14px; color: #555; text-align: center;">Stay connected with us for better health, every day.</p>

                <div style="text-align: center; font-size: 13px; color: #999; margin-top: 30px;">
                © 2025 MediLab | <a href="${process.env.SITE_DOMAIN_FULL}" style="color: #0066cc; text-decoration: none;">${process.env.SITE_DOMAIN}</a> | contact@${process.env.SITE_DOMAIN}
                </div>

            </div>
            `
        })

        res.send({
            result: "Done",
            data: data,
        })
    } catch (error) {
        // console.log(error)
        let errorMessage = {}
        error.keyValue ? errorMessage.email = "Your Email Address is Already Regsitered With Us" : null
        error.errors?.email ? errorMessage.email = error.errors.email.message : null
        res.status(Object.values(errorMessage).length ? 400 : 500).send({
            result: "Fail",
            reason: Object.values(errorMessage).length ? errorMessage : "Internal Server Error"
        })
    }
}
async function getRecord(req, res) {
    try {
        let data = await Newsletter.find({ user: req.params._id }).sort({ _id: -1 })

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
        let data = await Newsletter.findOne({ _id: req.params._id })
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
        let data = await Newsletter.findOne({ _id: req.params._id })
        if (data) {
            data.active = req.body?.active ?? data.active
            await data.save()

            res.send({
                result: "Done",
                data: data,
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
        let data = await Newsletter.findOne({ _id: req.params._id })
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