const bookModel = require("../model/bookModel")


exports.getBookFrmQuery = async (req, res) => {
    try {

        const queryData = req.query

        if (queryData.userId == "") {
            return res.status(400).send({ status: false, message: "please provide an userId in userId field!" })
        }

        if (queryData.category == "") {
            return res.status(400).send({ status: false, message: "please provide category in category field!" })
        }

        if (queryData.subcategory == "") {
            return res.status(400).send({ status: false, message: "please provide subcategory in sbcategory field!" })
        }

        queryData["isDeleted"] = false

        const bookData = await bookModel.find(queryData)

        if (bookData.length == 0) {
            return res.status(404).send({ status: false, message: "No book found!" })
        }

        return res.status(200).send({ status: true, data: bookData })
    }
    catch (err) {
        return res.status(500).send({ status: false, message: err.message })
    }
}