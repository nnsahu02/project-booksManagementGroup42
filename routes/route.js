const express = require('express');
const router = express.Router();

const userController = require('../controller/userController');
const bookController = require('../controller/bookController');
const auth = require('../middleware/auth');


/*.........................//1// CREAT USER //..............................................*/
router.post('/register', userController.createUser);


/*.........................//2// LOGIN USER //..............................................*/
router.post('/login', userController.login);


/*.........................//3// CREAT BOOKS //.............................................*/
router.post('/books', auth.authentication, auth.authorisation, bookController.createBook);


/*.........................//4// GET BOOKS FROM QUERY //....................................*/
router.get('/books',auth.authentication, bookController.getBookFrmQuery);


/*.........................//5// GET BOOK FROM PARAM //.....................................*/
router.get('/books/:bookId', auth.authentication, bookController.getBooksfrmParam);










/*...................................... VALIDATING END POINT/PATH ...............................................*/

router.all('/*', (req, res) => {
    return res.status(400).send({status : false, message : "Please provide correct path!"})
})


module.exports = router;