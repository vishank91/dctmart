const Checkout = require("../models/Checkout")
const mailer = require("../mailer/index")
const Razorpay = require("razorpay")

//Payment API
async function order(req, res) {
    try {
        const instance = new Razorpay({
            key_id: process.env.RPKEYID,
            key_secret: process.env.RPSECRETKEY,
        });

        const options = {
            amount: req.body.amount * 100,
            currency: "INR"
        };

        instance.orders.create(options, (error, order) => {
            if (error) {
                console.log(error);
                return res.status(500).json({ message: "Something Went Wrong!" });
            }
            res.json({ data: order });
        });
    } catch (error) {
        res.status(500).json({ message: "Internal Server Error!" });
        console.log(error);
    }
}

async function verifyOrder(req, res) {
    try {
        var check = await Checkout.findOne({ _id: req.body.checkid })
        check.rppid = req.body.razorpay_payment_id
        check.paymentStatus = "Done"
        check.paymentMode = "Net Banking"
        await check.save()
        res.send({ result: "Done", message: "Payment SuccessFull" });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal Server Error!" });
    }
}
async function createRecord(req, res) {
    try {
        let data = new Checkout(req.body)
        await data.save()

        let finalData = await Checkout.findOne({ _id: data._id })
            .populate("user", ["name", "username", "email", "phone", "address", "pin", "city", "state"])
            .populate({
                path: "products.product",
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

        console.log(finalData)

        const productRows = finalData.products.map(item => {
            return `
        <tr>
            <td>${item.product.name}</td>
            <td>${item.product.brand?.name}</td>
            <td>${item.product.color}</td>
            <td>${item.product.size}</td>
            <td>&#8377;${item.product.finalPrice}</td>
            <td>${item.qty}</td>
            <td>&#8377;${item.total}</td>
        </tr>
    `;
        }).join('');

        mailer.sendMail({
            from: process.env.MAIL_SENDER,
            to: finalData.user?.email,
            subject: `Your Order Has Been Placed : Team ${process.env.SITE_NAME}`,
            html: `
        <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; padding: 30px; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">

            <h2 style="text-align: center; color: #0066cc; margin-bottom: 20px;">✅ Checkout Request Received</h2>

            <p style="font-size: 16px; margin-bottom: 15px;">Dear <strong>${finalData.user.name}</strong>,</p>

            <p style="margin-bottom: 15px;">Thank you for placing an order with <strong>${process.env.SITE_NAME}</strong>. Your order has been received and is currently being reviewed by our team.</p>

            <p style="margin-bottom: 15px;">Here are the details of your order request:</p>

            <div style="background-color: #f1f1f1; padding: 15px; border-radius: 6px; margin-bottom: 20px;">
                <p style="margin: 5px 0;"><strong>Subtotal Amount : </strong> &#8377;${data.subtotal}</p>
                <p style="margin: 5px 0;"><strong>Shipping Amount : </strong> &#8377;${data.shipping}</p>
                <p style="margin: 5px 0;"><strong>Total Amount : </strong> &#8377;${data.total}</p>
                <p style="margin: 5px 0;"><strong>Date:</strong> ${new Date(data.createdAt).toLocaleString()}</p>
            </div>

            <h2>Product Details</h2>
            <table border="1" cellpadding="10" cellspacing="0" style="width: 100%; border-collapse: collapse;">
                <thead>
                    <tr>
                        <th>Product</th>
                        <th>Brand</th>
                        <th>Color</th>
                        <th>Size</th>
                        <th>Price</th>
                        <th>Qty</th>
                        <th>Total</th>
                    </tr>
                </thead>
                <tbody>
                    ${productRows}
                </tbody>
            </table>

            <div style="font-size: 14px; color: #777777; text-align: center; margin-top: 30px;">
                Warm regards,<br>
                <strong>The ${process.env.SITE_NAME} Team</strong><br>
                <a href="${process.env.SITE_DOMAIN_FULL}" style="color: #0066cc; text-decoration: none;">${process.env.SITE_DOMAIN}</a><br>
                contact@${process.env.SITE_EMAIL}
            </div>

        </div>
    `
        });

        mailer.sendMail({
            from: process.env.MAIL_SENDER,
            to: process.env.MAIL_SENDER,
            subject: `New Checkout Query Received : Team ${process.env.SITE_NAME}`,
            html: `
        <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; padding: 30px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">

            <h2 style="color: #009688; text-align: center; margin-bottom: 30px;">📅 New Checkout Request Received</h2>

            <h4>User Record : <br>
                User Name : ${finalData.user.username}<br>
                Name : ${finalData.user.name}<br>
                Email : ${finalData.user.email}<br>
                Phone : ${finalData.user.phone}<br>
                Address : ${finalData.user.address}<br>
                Pin : ${finalData.user.pin}<br>
                City : ${finalData.user.city}<br>
                State : ${finalData.user.state}<br>
            </h4>

            <p><strong>Subtotal Amount:</strong> &#8377;${data.subtotal}</p>
            <p><strong>Shipping Amount:</strong> &#8377;${data.shipping}</p>
            <p><strong>Total Amount:</strong> &#8377;${data.total}</p>
            <p><strong>Date:</strong> ${new Date(data.createdAt).toLocaleString()}</p>

            <h2>Product Details</h2>
            <table border="1" cellpadding="10" cellspacing="0" style="width: 100%; border-collapse: collapse;">
                <thead>
                    <tr>
                        <th>Product</th>
                        <th>Brand</th>
                        <th>Color</th>
                        <th>Size</th>
                        <th>Price</th>
                        <th>Qty</th>
                        <th>Total</th>
                    </tr>
                </thead>
                <tbody>
                    ${productRows}
                </tbody>
            </table>

            <hr style="border: none; border-top: 1px solid #dddddd; margin: 30px 0;">

            <div style="text-align: center; margin-top: 30px; font-size: 13px; color: #999;">
                © 2025 ${process.env.SITE_NAME} | 
                <a href="${process.env.SITE_DOMAIN_FULL}" style="color: #0066cc; text-decoration: none;">${process.env.SITE_DOMAIN}</a>
            </div>

        </div>
    `
        });

        res.send({
            result: "Done",
            data: finalData,
        })
    } catch (error) {
        console.log(error)
        let errorMessage = {}
        error.errors?.user ? errorMessage.user = error.errors.user.message : null
        error.errors?.subtotal ? errorMessage.subtotal = error.errors.subtotal.message : null
        error.errors?.shipping ? errorMessage.shipping = error.errors.shipping.message : null
        error.errors?.total ? errorMessage.total = error.errors.total.message : null

        res.status(Object.values(errorMessage).length ? 400 : 500).send({
            result: "Fail",
            reason: Object.values(errorMessage).length ? errorMessage : "Internal Server Error"
        })
    }
}
async function getRecord(req, res) {
    try {
        let data = await Checkout.find()
            .populate("user", ["name", "username", "email", "phone", "address", "pin", "city", "state"])
            .populate({
                path: "products.product",
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

async function getUserRecord(req, res) {
    try {
        let data = await Checkout.find({ user: req.params._id })
            .populate("user", ["name", "username", "email", "phone", "address", "pin", "city", "state"])
            .populate({
                path: "products.product",
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
        let data = await Checkout.findOne({ _id: req.params._id })
            .populate("user", ["name", "username", "email", "phone", "address", "pin", "city", "state"])
            .populate({
                path: "products.product",
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
        let data = await Checkout.findOne({ _id: req.params._id })
        if (data) {
            data.rppid = req.body?.rppid ?? data.rppid
            data.paymentMode = req.body?.paymentMode ?? data.paymentMode
            data.paymentStatus = req.body?.paymentStatus ?? data.paymentStatus
            data.orderStatus = req.body?.orderStatus ?? data.orderStatus
            await data.save()

            let finalData = await Checkout.findOne({ _id: data._id })
                .populate("user", ["name", "username", "email", "phone", "address", "pin", "city", "state"])
                .populate({
                    path: "products.product",
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

            const productRows = finalData.products.map(item => {
                return `
        <tr>
            <td>${item.product.name}</td>
            <td>${item.product.brand?.name}</td>
            <td>${item.product.color}</td>
            <td>${item.product.size}</td>
            <td>&#8377;${item.product.finalPrice}</td>
            <td>${item.qty}</td>
            <td>&#8377;${item.total}</td>
        </tr>
    `;
            }).join('');

            mailer.sendMail({
                from: process.env.MAIL_SENDER,
                to: finalData.user?.email,
                subject: `Your Order Status Has Been Updated : Team ${process.env.SITE_NAME}`,
                html: `
        <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; padding: 30px; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">

            <h2 style="text-align: center; color: #0066cc; margin-bottom: 20px;">✅ Checkout Request Received</h2>

            <p style="font-size: 16px; margin-bottom: 15px;">Dear <strong>${finalData.user.name}</strong>,</p>

            <p style="margin-bottom: 15px;">Thank you for placing an order with <strong>${process.env.SITE_NAME}</strong>. Your order status has been updated</p>

            <p style="margin-bottom: 15px;">Here are the details of your order:</p>

            <div style="background-color: #f1f1f1; padding: 15px; border-radius: 6px; margin-bottom: 20px;">
                <p style="margin: 5px 0;"><strong>Order Status : </strong> ${data.orderStatus}</p>
                <p style="margin: 5px 0;"><strong>Payment Status : </strong> ${data.paymentStatus}</p>
                <p style="margin: 5px 0;"><strong>Subtotal Amount : </strong> &#8377;${data.subtotal}</p>
                <p style="margin: 5px 0;"><strong>Shipping Amount : </strong> &#8377;${data.shipping}</p>
                <p style="margin: 5px 0;"><strong>Total Amount : </strong> &#8377;${data.total}</p>
                <p style="margin: 5px 0;"><strong>Date:</strong> ${new Date(data.createdAt).toLocaleString()}</p>
            </div>

            <h2>Product Details</h2>
            <table border="1" cellpadding="10" cellspacing="0" style="width: 100%; border-collapse: collapse;">
                <thead>
                    <tr>
                        <th>Product</th>
                        <th>Brand</th>
                        <th>Color</th>
                        <th>Size</th>
                        <th>Price</th>
                        <th>Qty</th>
                        <th>Total</th>
                    </tr>
                </thead>
                <tbody>
                    ${productRows}
                </tbody>
            </table>

            <div style="font-size: 14px; color: #777777; text-align: center; margin-top: 30px;">
                Warm regards,<br>
                <strong>The ${process.env.SITE_NAME} Team</strong><br>
                <a href="${process.env.SITE_DOMAIN_FULL}" style="color: #0066cc; text-decoration: none;">${process.env.SITE_DOMAIN}</a><br>
                contact@${process.env.SITE_EMAIL}
            </div>

        </div>
    `
            });
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
        console.log(error)
        res.status(500).send({
            result: "Fail",
            reason: "Internal Server Error"
        })
    }
}

async function deleteRecord(req, res) {
    try {
        let data = await Checkout.findOne({ _id: req.params._id })
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
    getUserRecord: getUserRecord,
    getSingleRecord: getSingleRecord,
    updateRecord: updateRecord,
    deleteRecord: deleteRecord,
    order: order,
    verifyOrder: verifyOrder
}