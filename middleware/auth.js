const jwt = require('jsonwebtoken')


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
            next()
        })
    }
    catch (err) {
        return res.status(500).send({ status: false, message: err.message })
    }
}



exports.authorisation = async (req, res, next) => {
    const userId = req.body.userId

    if (!userId) {
        return res.status(400).send({ status: false, message: "userId is required" })
    }

    const userIdfrmDecodedToken = req.token.userId

    if (userId !== userIdfrmDecodedToken) {
        return res.status(403).send({ status: false, message: "Access Denied!" })
    }

    next()
}



