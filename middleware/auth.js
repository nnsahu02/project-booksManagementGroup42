const jwt = require('jsonwebtoken')

const { isValidObjectId } = require('mongoose')


exports.authentication = async (req, res, next) => {
    try {
        const token = req.headers['x-api-key']

        if (!token) {
            return res.status(400).send({ status: false, message: "Token is required." })
        }


        const decodedToken = jwt.verify(token, 'group42-very-very-secret-key', function (err, decodedToken) {
            if (err) {
                return res.status(400).send({ status: false, message: err.message })
            }
            else {
                req.token = decodedToken
            }
            console.log("authentication successfull")
            next()
        })
    }
    catch (err) {
        console.log("authentication Failed!!")
        return res.status(500).send({ status: false, message: err.message })
    }
}



exports.authorisation = async (req, res, next) => {
    try {
        const userId = req.body.userId

        if (!userId) {
            return res.status(400).send({ status: false, message: "userId is required" })
        }
        if (!isValidObjectId(userId)) {
            return res.status(400).send({ status: false, message: "userId is invalid." })
        }

        const userIdfrmDecodedToken = req.token.userId

        if (userId !== userIdfrmDecodedToken) {
            return res.status(403).send({ status: false, message: "Access Denied!" })
        }
        console.log("Authorization successfull")

        next()
    }
    catch (err) {
        console.log("Authorization Failed!!")
        return res.status(500).send({ status: false, message: err.message })
    }
}



