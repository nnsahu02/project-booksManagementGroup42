const express = require('express');
const route = require('./routes/route');
const mongoose  = require('mongoose');
const multer  = require('multer')

const app = express();

app.use(express.json());

app.use(multer().any())

mongoose.connect("mongodb+srv://Rajnagwanshi:abhishek1410@cluster0.qlrpwrw.mongodb.net/group42Database", {
    useNewUrlParser: true
})
.then( () => console.log("MongoDb is connected"))
.catch ( err => console.log(err) )

app.use('/', route);


app.listen(3000, function () {
    console.log('Express app running on port ' + (3000))
});
