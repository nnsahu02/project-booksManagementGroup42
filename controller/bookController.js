const bookModel = require("../model/bookModel")
const userModel = require('../model/userModel')
const reviewModel = require('../model/reviewModel')
const { isValidObjectId } = require('mongoose')



//>---------------------------------------------- VALIDATION FUNCTION------------------------------------------------<//

const validation = require('../validation/validation')
let { isEmpty, isValidBookTitle, isVAlidISBN, isVAlidDate } = validation

//>-------------------------------------------------- CREAT BOOKS --------------------------------------------------<//

exports.createBook = async (req, res) => {
    try {
        let bodyData = req.body

        let { title, excerpt, userId, ISBN, category, subcategory, releasedAt, ...rest } = bodyData //Destructuring

        if (Object.keys(rest).length != 0) { //Checking extra attributes are added or not 
            return res.status(400).send({ msg: "Not allowed to add extra attributes" })
        }

        if (Object.keys(bodyData).length = 0) {
            res.status(400).send({ status: false, message: "All fields are mandatory" })
        }
        if (!title) {
            return res.status(400).send({ status: false, message: "title is required." })
        }
        if (!isValidBookTitle(title)) {
            return res.status(400).send({ status: false, message: "Please provide Valid Title." })
        }
        if (!excerpt) {
            return res.status(400).send({ status: false, message: "experpt is required." })
        }
        if (!userId) {
            return res.status(400).send({ status: false, message: "userId is required." })
        }
        if (!ISBN) {
            return res.status(400).send({ status: false, message: "ISBN is required." })
        }
        if (!isVAlidISBN(ISBN)) {
            return res.status(400).send({ status: false, message: "Please provide Valid ISBN." })
        }
        if (!category) {
            return res.status(400).send({ status: false, message: "category is required." })
        }
        if (!subcategory) {
            return res.status(400).send({ status: false, message: "subcategory is required." })
        }
        if (!releasedAt) {
            return res.status(400).send({ status: false, message: "releasedAt is required." })
        }
        if (!isVAlidDate(releasedAt)) {
            return res.status(400).send({ status: false, message: "The Date is in inValid Format." })
        }

        /*------------------------------------- CHECKING EMPTY AND STRING ------------------------------------------*/

        if (!isEmpty(title)) {
            return res.status(400).send({ status: false, message: "Title is required" })
        }
        if (!isEmpty(excerpt)) {
            return res.status(400).send({ status: false, message: "Name is required" })
        }
        if (!isEmpty(userId)) {
            return res.status(400).send({ status: false, message: "Phone Number  is required" })
        }
        if (!isEmpty(ISBN)) {
            return res.status(400).send({ status: false, message: "Email is required" })
        }
        if (!isEmpty(category)) {
            return res.status(400).send({ status: false, message: "Password is required" })
        }
        if (!isEmpty(subcategory)) {
            return res.status(400).send({ status: false, message: "Title is required" })
        }
        if (!isEmpty(releasedAt)) {
            return res.status(400).send({ status: false, message: "Name is required" })
        }


        /*---------------------------------------------- CHECKING UNIQUE ---------------------------------------------*/


        const titleCheck = await bookModel.findOne({ title })
        const ISBNCheck = await bookModel.findOne({ ISBN })

        if (titleCheck) {
            return res.status(400).send({ status: false, message: "This title is already exist." })
        }
        if (ISBNCheck) {
            return res.status(400).send({ status: false, message: "This ISBN is already exist." })
        }

        /*-----------------------------------------------------------------------------------------------------------*/


        let checkUserId = await userModel.findById(userId)
        if (!checkUserId) { return res.status(404).send({ status: false, message: "user not found" }) }

        let createBook = await bookModel.create(bodyData)

        return res.status(201).send({ status: true, message: `This ${title} Book is created sucessfully.`, data: createBook })

    } catch (error) {
        return res.status(500).send({ status: false, message: error.message })
    }
}

//>------------------------------------------------------------------------------------------------------------------<//



//>-------------------------------------------- GET BOOKS BY QUERY FILTER -------------------------------------------<//

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

        if (queryData.title == "") {
            return res.status(400).send({ status: false, message: "please provide title in title field!" })
        }

        if (queryData.ISBN == "") {
            return res.status(400).send({ status: false, message: "please provide ISBN in ISBN field!" })
        }


        queryData["isDeleted"] = false //added isDeleted attribute in queryData

        const bookData = await bookModel.find(queryData).sort({ title: 1 })

        if (bookData.length == 0) {
            return res.status(404).send({ status: false, message: "No book found!" })
        }

        let arr = []
        
        for(let i=0; i<bookData.length; i++){
            let bookDetails = bookData[i]
            const bookId = bookDetails._id
            
            const reviewsData = await reviewModel.find({bookId : bookId})
            
            arr.push(reviewsData)
            
        }
        bookData.push(arr)
        return res.status(200).send({ status: true,message : "Books list", data: bookData })

    }
    catch (err) {
        return res.status(500).send({ status: false, message: err.message })
    }
}

//>------------------------------------------------------------------------------------------------------------------<//



//>---------------------------------------------- GET BOOKS FROM PARAM ----------------------------------------------<//

exports.getBooksfrmParam = async (req, res) => {
    try {
        const bookId = req.params.bookId

        if (!bookId) {
            return res.status(400).send({ status: false, message: "bookId is required" })
        }

        const bookData = await bookModel.findById(bookId)

        if (!bookData) {
            return res.status(404).send({ status: false, message: "No book found with this Id" })
        }

        return res.status(200).send({ status: true, data: bookData })

    }
    catch (err) {
        return res.status(500).send({ status: false, message: err.message })
    }
}

//>------------------------------------------------------------------------------------------------------------------<//



//>------------------------------------------------ UPDATE BOOKS ----------------------------------------------------<//

exports.updateBook = async (req, res) => {
    try {
        const bookId = req.params.bookId

        if (!bookId) {
            return res.status(400).send({ status: false, message: "Please provide bookId in params." })
        }

        if (!isValidObjectId(bookId)) {
            return res.status(400).send({ status: false, message: "Please Provide valid BookId" })
        }

        const bookDetails = await bookModel.findById(bookId)
        if (!bookDetails) {
            return res.status(404).send({ status: false, message: "No book found with this Id !" })
        }

        if (bookDetails.isDeleted == true) {
            return res.status(400).send({ status: false, message: "The book wIth this Id is already Deleted!" })
        }

        const { title, excerpt, releasedAt, ISBN } = req.body

        /*------------------------------------- CHECKING EMPTY AND STRING ------------------------------------------*/

        if (!isEmpty(title)) {
            return res.status(400).send({ status: false, message: "Title is required" })
        }
        if (!isEmpty(excerpt)) {
            return res.status(400).send({ status: false, message: "Name is required" })
        }
        if (!isEmpty(releasedAt)) {
            return res.status(400).send({ status: false, message: "Name is required" })
        }
        if (!isEmpty(ISBN)) {
            return res.status(400).send({ status: false, message: "Email is required" })
        }

        /*------------------------------------- REGEX VALIDATION ------------------------------------------*/

        if (!isValidBookTitle(title)) {
            return res.status(400).send({ status: false, message: "Please provide Valid Title." })
        }

        if (!isVAlidISBN(ISBN)) {
            return res.status(400).send({ status: false, message: "Please provide Valid ISBN." })
        }

        if (!isVAlidDate(releasedAt)) {
            return res.status(400).send({ status: false, message: "The Date is in inValid Format." })
        }

        /*---------------------------------------------- CHECKING UNIQUE ---------------------------------------------*/

        const titleCheck = await bookModel.findOne({ title })
        const ISBNCheck = await bookModel.findOne({ ISBN })

        if (titleCheck) {
            return res.status(400).send({ status: false, message: "Can not save the same title." })

        }
        if (ISBNCheck) {
            return res.status(400).send({ status: false, message: "Can not save the same ISBN." })

        }

        const updateBook = await bookModel.findByIdAndUpdate(
            { _id: bookId },
            {
                $set: {
                    title: title,
                    excerpt: excerpt,
                    releasedAt: releasedAt,
                    ISBN: ISBN
                }
            },
            { new: true }
        )

        return res.status(200).send({ status: true, message: "Book updated succesfully. ", data: updateBook })

    }
    catch (error) {
        return res.status(500).send({ status: false, message: error.message })
    }
}

//>------------------------------------------------------------------------------------------------------------------<//


//>---------------------------------------------- DELETE BOOKS ----------------------------------------------<//


exports.DeleteBook = async function (req, res) {
    try {
        const bookId = req.params.bookId

        if (!bookId) {
            return res.status(400).send({ status: false, message: "Provide bookId" })
        }

        if (!isValidObjectId(bookId)) {
            return res.status(400).send({ status: false, message: "Please Provide valid BookId" })
        }

        const bookDetails = await bookModel.findById(bookId)
        if(!bookDetails){
            return res.status(404).send({status : false, message : "No book Found with this Id!"})
        }
        
        if (bookDetails.isDeleted == true) {
            return res.status(400).send({ status: false, message: "The book wIth this Id is already Deleted!" })
        }

        let deleteByBookId = await bookModel.findOneAndUpdate(
            { _id: bookId, isDeleted: false },
            { isDeleted: true, deletedAt: Date.now() },
            { new: true }
        )

        if (!deleteByBookId) {
            return res.status(404).send({ status: false, message: "No Book document found" })
        }
        return res.status(200).send({ status: true, message: "Book successfully deleted.", data: deleteByBookId })
    } catch (error) {
        return res.status(500).send({ status: false, message: error.message })
    }
}

//>------------------------------------------------------------------------------------------------------------------<//



