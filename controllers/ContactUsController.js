const ContactUs = require("../models/ContactUs")
const mailer = require("../mailer/index")

async function createRecord(req, res) {
    try {
        let data = new ContactUs(req.body)
        await data.save()

        mailer.sendMail({
            from: process.env.MAIL_SENDER,
            to: data.email,
            subject: `Thank You for Contacting ${process.env.SITE_NAME} - We've Received Your Message`,
            html: `
                <h2 style="text-align: center; color: #0066cc;">Thank You for Contacting ${process.env.SITE_NAME}</h2>
                <p style="margin-bottom: 15px;">Dear <strong>${data.name}</strong>,</p>
                
                <p style="margin-bottom: 15px;">Thank you for reaching out to <strong>${process.env.SITE_NAME}</strong>. We have successfully received your message and our team is reviewing your query.</p>
                
                <p style="margin-bottom: 15px;">One of our representatives will get back to you shortly with the necessary information or next steps. We aim to respond within 24 hours, and often even sooner.</p>
                
                <div style="background-color: #f1f1f1; padding: 15px; border-radius: 6px; margin-top: 20px; margin-bottom: 20px;">
                <p style="margin: 5px 0;"><strong>Name:</strong> ${data.name}</p>
                <p style="margin: 5px 0;"><strong>Email:</strong> ${data.email}</p>
                <p style="margin: 5px 0;"><strong>Subject:</strong> ${data.subject}</p>
                <p style="margin: 5px 0;"><strong>Message:</strong><br> ${data.message}</p>
                </div>
                
                <p style="margin-bottom: 15px;">If your inquiry is urgent, feel free to call us directly at <strong>${process.env.SITE_PHONE}</strong>.</p>
                
                <p style="margin-bottom: 30px;">Thank you for choosing ${process.env.SITE_NAME}. We're here to support your queries.</p>
                
                <div style="font-size: 14px; color: #777777; text-align: center;">
                Warm regards,<br>
                <strong>${process.env.SITE_NAME} Team</strong><br>
                <a href="${process.env.SITE_DOMAIN_FULL}" style="color: #0066cc; text-decoration: none;">${process.env.SITE_DOMAIN}</a><br>
                contact@ ${process.env.SITE_EMAIL}
                </div>
            `
        })
        mailer.sendMail({
            from: process.env.MAIL_SENDER,
            to: process.env.MAIL_SENDER,
            subject: `New Contact Us Query Recieved : Team ${process.env.SITE_NAME}`,
            html: `
                <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; padding: 30px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
                    <h2 style="color: #cc0000; text-align: center; margin-bottom: 30px;">📥 New Contact Us Query Received</h2>
                    <p style="margin-bottom: 10px;"><strong>Name:</strong> ${data.name}</p>
                    <p style="margin-bottom: 10px;"><strong>Email:</strong> ${data.email}</p>
                    <p style="margin-bottom: 10px;"><strong>Phone:</strong>${data.phone}</p>
                    <p style="margin-bottom: 10px;"><strong>Subject:</strong> ${data.subject}</p>
                    <p style="margin-bottom: 20px;"><strong>Message:</strong><br> ${data.message}</p>

                    <hr style="border: none; border-top: 1px solid #dddddd; margin: 30px 0;">

                    <p style="font-size: 14px; color: #555;">This message was automatically sent from the ${process.env.SITE_NAME} website Contact Us form.</p>

                    <div style="text-align: center; margin-top: 30px; font-size: 13px; color: #999;">
                    © 2025 ${process.env.SITE_NAME} | <a href="${process.env.SITE_DOMAIN_FULL}" style="color: #0066cc; text-decoration: none;">${process.env.SITE_DOMAIN}</a>
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
        error.errors?.name ? errorMessage.name = error.errors.name.message : null
        error.errors?.email ? errorMessage.email = error.errors.email.message : null
        error.errors?.phone ? errorMessage.phone = error.errors.phone.message : null
        error.errors?.subject ? errorMessage.subject = error.errors.subject.message : null
        error.errors?.message ? errorMessage.message = error.errors.message.message : null
        res.status(Object.values(errorMessage).length ? 400 : 500).send({
            result: "Fail",
            reason: Object.values(errorMessage).length ? errorMessage : "Internal Server Error"
        })
    }
}
async function getRecord(req, res) {
    try {
        let data = await ContactUs.find({ user: req.params._id }).sort({ _id: -1 })
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
        let data = await ContactUs.findOne({ _id: req.params._id })
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
        let data = await ContactUs.findOne({ _id: req.params._id })
        if (data) {
            data.active = req.body?.active ?? data.active
            await data.save()

            if (!(req.body.active)) {
                mailer.sendMail({
                    from: process.env.MAIL_SENDER,
                    to: data.email,
                    subject: `Your Query Has Been Resolved - Team ${process.env.SITE_NAME}`,
                    html: `
                <h2 style="text-align: center; color: #0066cc;">Thank You for Contacting ${process.env.SITE_NAME}</h2>
                <p style="margin-bottom: 15px;">Dear <strong>${data.name}</strong>,</p>
                
                <p style="margin-bottom: 15px;">Thank you for reaching out to <strong>${process.env.SITE_NAME}</strong>. We have successfully solved your query </p>
                
                <p style="margin-bottom: 15px;">If Still You Have Some Query. Plase Contact Us Again</p>
                
                <h3>Following Query Has Been Resolved</h1>
                <div style="background-color: #f1f1f1; padding: 15px; border-radius: 6px; margin-top: 20px; margin-bottom: 20px;">
                <p style="margin: 5px 0;"><strong>Name:</strong> ${data.name}</p>
                <p style="margin: 5px 0;"><strong>Email:</strong> ${data.email}</p>
                <p style="margin: 5px 0;"><strong>Subject:</strong> ${data.subject}</p>
                <p style="margin: 5px 0;"><strong>Message:</strong><br> ${data.message}</p>
                </div>
                
                <div style="font-size: 14px; color: #777777; text-align: center;">
                Warm regards,<br>
                <strong>${process.env.SITE_NAME} Team</strong><br>
                <a href="${process.env.SITE_DOMAIN_FULL}" style="color: #0066cc; text-decoration: none;">${process.env.SITE_DOMAIN}</a><br>
                contact@ ${process.env.SITE_EMAIL}
                </div>
            `
                })
            }

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
        let data = await ContactUs.findOne({ _id: req.params._id })
        if (data) {
            if (data.active) {
                res.status(404).send({
                    result: "Fail",
                    reason: "This Query is Active. You Can't Delete an Active Query"
                })

            }
            else {
                await data.deleteOne()
                res.send({
                    result: "Done"
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