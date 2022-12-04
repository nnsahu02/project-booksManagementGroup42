const bookModel = require("../model/bookModel")

const userModel = require('../model/userModel')

const reviewModel = require('../model/reviewModel')

const { isValidObjectId } = require('mongoose')

const moment = require('moment')



//>----------------------------------- VALIDATION FUNCTION ----------------------------------<//

const validation = require('../validation/validation')

let { isEmpty, isValidBookTitle, isVAlidISBN, isVAlidDate } = validation


//>-------------------------------------- CREAT BOOKS ----------------------------------------<//

exports.createBook = async (req, res) => {

    try {
        let bodyData = req.body

        let { title, excerpt, userId, ISBN, category, subcategory, releasedAt, isDeleted, reviews, ...rest } = bodyData //Destructuring

       
        if (Object.keys(rest).length != 0) { //Checking extra attributes are added or not 
            return res.status(400).send({ status:false,message: "Not allowed to add extra attributes" })
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

        /*-------------------------------- CHECKING EMPTY AND STRING ----------------------------*/

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


        /*----------------------------------- CHECKING UNIQUE -----------------------------*/


        const titleCheck = await bookModel.findOne({ title })

        const ISBNCheck = await bookModel.findOne({ ISBN })

        if (titleCheck) {
            return res.status(400).send({ status: false, message: "This title is already exist." })
        }
        if (ISBNCheck) {
            return res.status(400).send({ status: false, message: "This ISBN is already exist." })
        }


        /*---------------------------------------------------------------------------------------*/
        

        let titleUpper = title.charAt(0).toUpperCase() + title.slice(1)
        req.body.title = titleUpper

        let createBook = await bookModel.create(bodyData)

        return res.status(201).send({ status: true, message: `This ${title} Book is created sucessfully.`, data: createBook })

    } catch (error) {
        return res.status(500).send({ status: false, message: error.message })
    }
}

//>-------------------------------------------------------------------------------------------------------------<//



//>------------------------------- GET BOOKS BY QUERY FILTER ----------------------------------<//

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

        const bookData = await bookModel.find(queryData).select({ title: 1, excerpt: 1, userId: 1, category: 1, releasedAt: 1, reviews: 1 }).sort({ title: 1 })

        if (bookData.length == 0) {
            return res.status(404).send({ status: false, message: "No book found!" })
        }


        return res.status(200).send({ status: true, message: "Books list", data: bookData })

    }
    catch (err) {
        return res.status(500).send({ status: false, message: err.message })
    }
}

//>------------------------------------------------------------------------------------------------------------------<//



//>-------------------------------------- GET BOOKS FROM PARAM -------------------------------------<//

exports.getBooksfrmParam = async (req, res) => {
    try {
        const bookId = req.params.bookId

        // if (!bookId) {
        //     return res.status(400).send({ status: false, message: "bookId is required" })
        // }

        const bookData = await bookModel.findById(bookId)

        if (!bookData) {
            return res.status(404).send({ status: false, message: "No book found with this Id" })
        }
        if (bookData.isDeleted == true) {
            return res.status(400).send({ status: false, message: "The book wIth this Id is already Deleted!" })
        }

        const reviewData = await reviewModel.find({ bookId: bookId, isDeleted: false }).select({isDeleted : 0, createdAt : 0, updatedAt : 0, __v : 0})

        const booksData = {
            _id : bookData._id,
            title: bookData.title,
            excerpt: bookData.excerpt,
            userId: bookData.userId,
            category: bookData.category,
            subcategory: bookData.subcategory,
            isDeleted: bookData.isDeleted,
            reviews: reviewData.length,
            releasedAt : bookData.releasedAt,
            createdAt : bookData.createdAt,
            updatedAt : bookData.updatedAt,
            reviewData: reviewData
        }

        return res.status(200).send({ status: true, data: booksData })

    }
    catch (err) {
        return res.status(500).send({ status: false, message: err.message })
    }
}

//>------------------------------------------------------------------------------------------------------------<//


//>-------------------------------------- UPDATE BOOKS --------------------------------------------<//

exports.updateBook = async (req, res) => {

    try {
        const bookId = req.params.bookId;

        let data = req.body

        const { title, excerpt, releasedAt, ISBN, ...rest } = data

        if (Object.keys(data).length == 0) {
            return res.status(400).send({status: false, message: "Body is empty" })
        }
        if (Object.keys(rest).length > 0) {
            return res.status(400).send({status: false, message: "extra attribute is not allowed." })
        }

       

        if (!(title || excerpt || releasedAt || ISBN)) {
            return res.status(400).send({ status: false, message: "The value field can not be empty." })
        }

        if (title) {

            if (!isEmpty(title)) {
                return res.status(400).send({ status: false, message: "Title is required" });
            }

            if (!isValidBookTitle(title)) {
                return res.status(400).send({ status: false, message: "Please provide Valid Title." });
            }

        }

        if (excerpt) {
            if (!isEmpty(excerpt)) {
                return res.status(400).send({ status: false, message: "excerpt is required" });
            }
        }

        if (releasedAt) {

            if (!isEmpty(releasedAt)) {
                return res.status(400).send({ status: false, message: "Date is required" });
            }
            if (!isVAlidDate(releasedAt)) {
                return res.status(400).send({ status: false, message: "The Date is in inValid Format." });
            }
        }

        if (ISBN) {

            if (!isEmpty(ISBN)) {
                return res.status(400).send({ status: false, message: "ISBN is required" });
            }
            if (!isVAlidISBN(ISBN)) {
                return res.status(400).send({ status: false, message: "Please provide Valid ISBN." });
            }
        }


        const titleCheck = await bookModel.findOne({ title });

        if (titleCheck) {
            return res.status(400).send({ status: false, message: "Can not save the same title." });
        }

        const ISBNCheck = await bookModel.findOne({ ISBN });

        if (ISBNCheck) {
            return res.status(400).send({ status: false, message: "Can not save the same ISBN." });
        }

        const updateBook = await bookModel.findByIdAndUpdate(
            { _id: bookId },
            {
                $set: {
                    title: title,
                    excerpt: excerpt,
                    releasedAt: releasedAt,
                    ISBN: ISBN,
                },
            },
            { new: true }
        );

        return res.status(200).send({
            status: true,
            message: "Book updated succesfully. ",
            data: updateBook,
        });
    } catch (error) {
        return res.status(500).send({ status: false, message: error.message });
    }
};

             //>----------------------------------------------------------------------------------<//


//>---------------------------------------------- DELETE BOOKS ----------------------------------------------<//


exports.DeleteBook = async function (req, res) {
    try {
        const bookId = req.params.bookId

        // if (!bookId) {
        //     return res.status(400).send({ status: false, message: "Provide bookId" })
        // }

        if (!isValidObjectId(bookId)) {
            return res.status(400).send({ status: false, message: "Please Provide valid BookId" })
        }

        // const bookDetails = await bookModel.findById(bookId)
        // if (!bookDetails) {
        //     return res.status(404).send({ status: false, message: "No book Found with this Id!" })
        // }

        // if (bookDetails.isDeleted == true) {
        //     return res.status(400).send({ status: false, message: "The book wIth this Id is already Deleted!" })
        // }

        let deleteByBookId = await bookModel.findOneAndUpdate(
            { _id: bookId, isDeleted: false },
            { isDeleted: true, deletedAt:moment().format("dddd, MMMM Do YYYY, h:mm:ss") },
            { new: true }
        )

        let DeleteReview = await reviewModel.updateMany(
            { bookId: bookId },
            { isDeleted: true },
            { new: true }
        );

        const deleteData = {
            title: deleteByBookId.title,
            excerpt: deleteByBookId.excerpt,
            userId: deleteByBookId.userId,
            ISBN: deleteByBookId.ISBN,
            category: deleteByBookId.category,
            subcategory: deleteByBookId.subcategory,
            reviews: 0,
            isDeleted: deleteByBookId.isDeleted,
            deletedAt: deleteByBookId.deletedAt,
            releasedAt: deleteByBookId.releasedAt
        };


        if (!deleteByBookId) {
            return res.status(404).send({ status: false, message: "No Book document found" })
        }

        return res.status(200).send({ status: true, message: "Book successfully deleted.", data: deleteData })

    } 
    catch (error) {
        return res.status(500).send({ status: false, message: error.message })
    }
}

//>----------------------------------------------------------------------------------------------------------<//



