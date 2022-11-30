const express = require('express');
const router = express.Router();

const userController = require('../controller/userController');
const bookController = require('../controller/bookController');
const reviewController = require('../controller/reviewController')
const auth = require('../middleware/auth');

//USER//
/*.........................//1// CREAT USER //..............................................*/

router.post('/register', userController.createUser);

/*.........................//2// LOGIN USER //..............................................*/

router.post('/login', userController.login);


//BOOK//
/*.........................//3// CREAT BOOKS //.............................................*/

router.post('/books', auth.authentication, auth.authorisation, bookController.createBook);

/*.........................//4// GET BOOKS FROM QUERY //....................................*/

router.get('/books', auth.authentication, bookController.getBookFrmQuery);

/*.........................//5// GET BOOK FROM PARAM //.....................................*/

router.get('/books/:bookId', auth.authentication, bookController.getBooksfrmParam);

/*.........................//6// UPDATE BOOK  //............................................*/

router.put('/books/:bookId', auth.authentication, auth.authoriseforUpdate, bookController.updateBook)

/*.........................//7// DELETE BOOK  //............................................*/

router.delete('/books/:bookId', auth.authentication, auth.authoriseforUpdate, bookController.DeleteBook)


//REVIEW//
/*.........................//8// CREATE REVIEW  //............................................*/

router.post('/books/:bookId/review', reviewController.review);

/*.........................//9// UPDATE REVIEW  //............................................*/

router.put('/books/:bookId/review/:reviewId', reviewController.updateReview);

/*.........................//10// DELETE REVIEW  //............................................*/

router.delete('/books/:bookId/review/:reviewId', reviewController.DeleteReview);



/*............................ VALIDATING END POINT/PATH ........................................*/

router.all('/*', (req, res) => {
    return res.status(400).send({ status: false, message: "Please provide correct path!" })
})


module.exports = router;