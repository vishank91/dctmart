const fs = require("fs")

const passwordValidator = require("password-validator")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")


const User = require("../models/User")
const mailer = require("../mailer/index")

var schema = new passwordValidator();
schema
    .is().min(8)                                    // Minimum length 8
    .is().max(100)                                  // Maximum length 100
    .has().uppercase(1)                             // Must have at least 1 uppercase letter
    .has().lowercase(1)                             // Must have at least 1 lowercase letter
    .has().digits(1)                                // Must have at least 1 digits
    .has().not().spaces()                           // Should not have spaces
    .is().not().oneOf(['Passw0rd', 'Password123']); // Blacklist these values
async function createRecord(req, res) {

    if (req.body.password === req.body.cpassword) {
        let data = new User(req.body)
        if (schema.validate(req.body.password)) {
            bcrypt.hash(req.body.password, 12, async (error, hash) => {
                try {
                    data.password = hash
                    await data.save()
                    res.send({
                        result: "Done",
                        data: data
                    })
                } catch (error) {
                    console.log(error)
                    let errorMessage = {}
                    error.keyValue && error.keyValue.username ? errorMessage.username = "User Name is Already Taken" : null
                    error.keyValue && error.keyValue.email ? errorMessage.email = "Email Address is Already Taken" : null
                    error.errors?.name ? errorMessage.name = error.errors.name.message : null
                    error.errors?.username ? errorMessage.username = error.errors.username.message : null
                    error.errors?.email ? errorMessage.email = error.errors.email.message : null
                    error.errors?.phone ? errorMessage.phone = error.errors.phone.message : null
                    error.errors?.password ? errorMessage.password = error.errors.password.message : null

                    res.status(Object.values(errorMessage).length ? 400 : 500).send({
                        result: "Fail",
                        reason: Object.values(errorMessage).length ? errorMessage : "Internal Server Error"
                    })
                }
            })
        }
        else {
            res.send({
                result: "Fail",
                reason: { password: "Invalid Password. Password Must Contains Alteast 1 Upper Case Character, 1 Lower Case Character, 1 Digit and Length Must be 8-100 Character" }
            })
        }
    }
    else {
        res.status(400).send({
            result: "Fail",
            reason: { password: "Password and Confirm Password Doesn't Matched" }
        })
    }
}
async function getRecord(req, res) {
    try {
        let data = await User.find().sort({ _id: -1 })
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
        let data = await User.findOne({ _id: req.params._id })
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
        console.log(req.body,req.files,req.file)
        let data = await User.findOne({ _id: req.params._id })
        if (data) {
            data.name = req.body?.name ?? data.name
            data.username = req.body?.username ?? data.username
            data.email = req.body?.email ?? data.email
            data.phone = req.body?.phone ?? data.phone
            data.address = req.body?.address ?? data.address
            data.pin = req.body?.pin ?? data.pin
            data.city = req.body?.city ?? data.city
            data.state = req.body?.state ?? data.state
            data.role = req.body?.role ?? data.role
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
        error.keyValue ? errorMessage.name = "User Name is Already Exist" : null

        res.status(Object.values(errorMessage).length ? 400 : 500).send({
            result: "Fail",
            reason: Object.values(errorMessage).length ? errorMessage : "Internal Server Error"
        })
    }
}

async function deleteRecord(req, res) {
    try {
        let data = await User.findOne({ _id: req.params._id })
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

async function login(req, res) {
    try {
        let data = await User.findOne({
            $or: [
                { username: req.body.username },
                { email: req.body.username }
            ]
        })
        if (data) {
            if (await bcrypt.compare(req.body.password, data.password)) {
                let key = data.role === "Buyer" ? process.env.JWT_SECRET_KEY_BUYER : (data.role === "Admin" ? process.env.JWT_SECRET_KEY_ADMIN : process.env.JWT_SECRET_KEY_SUPER_ADMIN)
                jwt.sign({ data }, key, { expiresIn: "15 days" }, (error, token) => {
                    if (error) {
                        res.status(500).send({
                            result: "Fail",
                            reason: "Internal Server error"
                        })
                    }
                    else {
                        res.send({
                            result: "Done",
                            data: data,
                            token: token
                        })
                    }
                })
            }
            else {
                res.status(401).send({
                    result: "Fail",
                    reason: { username: "Invalid Usernae or Password" }
                })
            }
        }
        else {
            res.status(401).send({
                result: "Fail",
                reason: { username: "Invalid Usernae or Password" }
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

async function forgetPasword1(req, res) {
    try {
        let data = await User.findOne({
            $or: [
                { username: req.body.username },
                { email: req.body.username }
            ]
        })
        if (data) {
            let otp = Number(Number(Math.random().toString().slice(2, 7)).toString().padEnd(6, "1"))
            data.otp = otp
            await data.save()

            mailer.sendMail({
                from: process.env.MAIL_SENDER,
                to: data.email,
                subject: `Password Reset OTP - ${process.env.SITE_NAME} Newsletter `,
                html: `
                      <div style="max-width: 600px; margin: auto; background-color: #ffffff; padding: 30px; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">

                        <h2 style="text-align: center; color: #0066cc; margin-bottom: 20px;">🔐 Password Reset Request</h2>

                        <p style="font-size: 16px; margin-bottom: 15px;">Hi <strong>${data.name}</strong>,</p>

                        <p style="margin-bottom: 15px;">We received a request to reset your password for your <strong>${process.env.SITE_NAME}</strong> account. Please use the following One-Time Password (OTP) to proceed:</p>

                        <div style="text-align: center; margin: 30px 0;">
                        <p style="font-size: 24px; font-weight: bold; color: #009688; letter-spacing: 2px;">${otp}</p>
                        </div>

                        <p style="margin-bottom: 15px;">This OTP is valid for the next <strong>10 minutes</strong>. If you did not request a password reset, you can safely ignore this email.</p>

                        <p style="font-size: 14px; color: #555;">Thank you for choosing ${process.env.SITE_NAME}</p>

                        <div style="text-align: center; font-size: 13px; color: #999; margin-top: 30px;">
                        © 2025 ${process.env.SITE_NAME} | <a href="${process.env.SITE_DOMAIN_FULL}" style="color: #0066cc; text-decoration: none;">${process.env.SITE_DOMAIN}</a> | contact@${process.env.SITE_EMAIL}
                        </div>

                    </div>
                `
            })
            res.send({
                result: "Done",
                message: "OTP Has Been Sent On Your Registered Email Address"
            })
        }
        else
            res.status(404).send({
                result: "Fail",
                reason: {
                    username: "User Not Found"
                }
            })
    } catch (error) {
        res.status(500).send({
            result: "Fail",
            reason: "Internal Server Error"
        })
    }
}


async function forgetPasword2(req, res) {
    try {
        let data = await User.findOne({
            $or: [
                { username: req.body.username },
                { email: req.body.username }
            ]
        })
        if (data) {
            if (data.otp == req.body.otp)
                res.send({
                    result: "Done"
                })
            else
                res.status(404).send({
                    result: "Fail",
                    reason: "Invalid OTP"
                })
        }
        else
            res.status(404).send({
                result: "Fail",
                reason: "Un-authorised Activity"
            })
    } catch (error) {
        res.status(500).send({
            result: "Fail",
            reason: "Internal Server Error"
        })
    }
}

async function forgetPasword3(req, res) {
    try {
        let data = await User.findOne({
            $or: [
                { username: req.body.username },
                { email: req.body.username }
            ]
        })
        if (data) {
            if (req.body.password === req.body.cpassword) {
                if (schema.validate(req.body.password)) {
                    bcrypt.hash(req.body.password, 12, async (error, hash) => {
                        data.password = hash
                        await data.save()
                        res.send({
                            result: "Done"
                        })
                    })
                }
                else
                    res.status(400).send({
                        result: "Fail",
                        reason: {
                            password: "Invalid Password. Password Must Contains Alteast 1 Upper Case Character, 1 Lower Case Character, 1 Digit and Length Must be 8-100 Character"
                        }
                    })
            }
            else {
                res.status(400).send({
                    result: "Fail",
                    reason: {
                        password: "Password and Confirm Password Doesn't Matched"
                    }
                })
            }
        }
        else
            res.status(404).send({
                result: "Fail",
                reason: "Un-authorised Activity"
            })
    } catch (error) {
        res.status(500).send({
            result: "Fail",
            reason: "Internal Server Error"
        })
    }
}

module.exports = {
    createRecord: createRecord,
    getRecord: getRecord,
    getSingleRecord: getSingleRecord,
    updateRecord: updateRecord,
    deleteRecord: deleteRecord,
    login: login,
    forgetPasword1: forgetPasword1,
    forgetPasword2: forgetPasword2,
    forgetPasword3: forgetPasword3,
}