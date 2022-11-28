const mongoose = require('mongoose')
const ObjectId = mongoose.Schema.Types.ObjectId


const bookModel = new mongoose.Schema({

    title: {
        type: String,
        require: true,
        unique: true,
        trim: true
    },
    excerpt: {
        type: String,
        require: true
    },
    userId: {
        type: ObjectId,
        require: true,
        ref: 'User'
    },
    ISBN: {
        type: String,
        require: true,
        unique: true
    },
    category: {
        type: String,
        require: true
    },
    subcategory: {
        type: String,
        require: true
    },
    reviews: {
        type: Number,
        default: 0
    },
    deletedAt: {
        type: Date
    },
    isDeleted: {
        type: Boolean,
        default: false
    },
    releasedAt: {
        type: Date,
        require: true,
    },


}, { timestamps: true })


module.exports = mongoose.model('book',bookModel)