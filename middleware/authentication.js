const jwt = require("jsonwebtoken")

function verifySuperAdmin(req, res, next) {
    let token = req.headers.authorization
    if (token) {
        try {
            jwt.verify(token, process.env.JWT_SECRET_KEY_SUPER_ADMIN)
            next()
        } catch (error) {
            res.status(401).send({
                result: "Fail",
                reason: {
                    tokenError: "Invalid or Expired Session. Please Login Again"
                }
            })
        }
    }
    else {
        res.status(401).send({
            result: "Fail",
            reason: "You Are Not Authorized to Access This API"
        })
    }
}

function verifyAdmins(req, res, next) {
    let token = req.headers.authorization
    if (token) {
        try {
            jwt.verify(token, process.env.JWT_SECRET_KEY_SUPER_ADMIN)
            next()
        } catch (error) {
            try {
                jwt.verify(token, process.env.JWT_SECRET_KEY_ADMIN)
                next()
            } catch (error) {
                res.status(401).send({
                    result: "Fail",
                    reason: {
                        tokenError: "Invalid or Expired Session. Please Login Again"
                    }
                })
            }
        }
    }
    else {
        res.status(401).send({
            result: "Fail",
            reason: "You Are Not Authorized to Access This API"
        })
    }
}

function verifyAll(req, res, next) {
    let token = req.headers.authorization
    if (token) {
        try {
            jwt.verify(token, process.env.JWT_SECRET_KEY_SUPER_ADMIN)
            next()
        } catch (error) {
            try {
                jwt.verify(token, process.env.JWT_SECRET_KEY_ADMIN)
                next()
            } catch (error) {
                try {
                    jwt.verify(token, process.env.JWT_SECRET_KEY_BUYER)
                    next()
                } catch (error) {
                    res.status(401).send({
                        result: "Fail",
                        reason: {
                            tokenError: "Invalid or Expired Session. Please Login Again"
                        }
                    })
                }
            }
        }
    }
    else {
        res.status(401).send({
            result: "Fail",
            reason: "You Are Not Authorized to Access This API"
        })
    }
}


module.exports = {
    verifySuperAdmin: verifySuperAdmin,
    verifyAdmins: verifyAdmins,
    verifyAll: verifyAll
}