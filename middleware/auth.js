const jwt = require('jsonwebtoken')

const { isValidObjectId } = require('mongoose')

const bookModel = require('../model/bookModel')

const userModel = require('../model/userModel')


//>----------------------------------- AUTHENTICATION ----------------------------------------<//

exports.authentication = async (req, res, next) => {

    try {

        const token = req.headers['x-api-key']

        if (!token) {
            return res.status(400).send({ status: false, message: "Token is required." })
        }

        const decodedToken = jwt.verify(token, 'group42-very-very-secret-key', function (err, decodedToken) {
            if (err) {
                console.log("Authentication Failed!!")
                return res.status(401).send({ status: false, message: err.message })
            }
            else {
                req.token = decodedToken
                console.log("Authentication Successful")
            }

            next()
        })
    }

    catch (err) {

        return res.status(500).send({ status: false, message: err.message })
    }
}


//>--------------------------------- AUTHORISATION --------------------------------<//


exports.authorisation = async (req, res, next) => {
    try {

        const bodyData = req.body

        const userId = bodyData.userId

        if (Object.keys(bodyData).length == 0) {// Checking body is empty or not
            return res.status(400).send({ status: false, message: "Body is empty" })
        }

        if (!userId) {
            return res.status(400).send({ status: false, message: "userId is required" })
        }

        if (!isValidObjectId(userId)) {
            return res.status(400).send({ status: false, message: "userId is invalid." })
        }
        
        const userData = await userModel.findById(userId)

        if (!userData) {
            return res.status(404).send({ status: false, message: "No user found with this Id!" })
        }

        const userIdfrmDecodedToken = req.token.userId

        if (userId !== userIdfrmDecodedToken) {
            console.log("Authorization Failed!!")
            return res.status(403).send({ status: false, message: "Access Denied!" })
        }

        console.log("Authorization Successful")
        next()
    }
    catch (err) {

        return res.status(500).send({ status: false, message: err.message })
    }
}


//>----------------------------- AUTHORISATION --------------------------------<//


exports.authoriseforUpdate = async (req, res, next) => {

    try {
        const bookId = req.params.bookId

        // if (!bookId) {
        //     return res.status(400).send({ status: false, message: "Please provide bookId in params." })
        // }

        if (!isValidObjectId(bookId)) {
            return res.status(400).send({ status: false, message: "bookId is invalid." })
        }

        const bookData = await bookModel.findById(bookId)

        if (!bookData) {
            return res.status(404).send({ status: false, message: "No book found with this Id!" })
        }

        if (bookData.isDeleted == true) {
            return res.status(400).send({ status: false, message: "The book with this Id is already Deleted!" })
        }

        const userId = bookData.userId.toString()

        const userIdfrmDecodedToken = req.token.userId

        if (userId !== userIdfrmDecodedToken) {
            console.log("Authorization Failed!!")
            return res.status(403).send({ status: false, message: "Access Denied!" })
        }
        console.log("Authorization Successful")
        next()
    }

    catch (err) {
        
        return res.status(500).send({ status: false, message: err.message })
    }
}


