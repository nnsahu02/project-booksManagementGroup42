const mongoose = require("mongoose")
const ObjectId = mongoose.Schema.Types.ObjectId

const bookSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
            unique: true,
            trim : true
        },
        excerpt: {
            type: String,
            required: true,
            trim : true
        },
        userId: {
            type: ObjectId,
            required: true,
            ref: 'user'
        },
        ISBN: {
            type: String,
            required: true,
            unique: true
        },
        category: {
            type: String,
            required: true,
            trim : true
        },
        subcategory: {
            type: String,
            required: true,
            trim : true
        },
        reviews: {
            type: Number,
            default: 0
        },
        isDeleted: {
            type: Boolean,
            default: false
        },
        deletedAt: {
            type: Date,
            default: null
        },
        releasedAt: {
            type: String,
            required: true,
            format : "date"
        
        }
    }, { timestamps: true }
)

module.exports = mongoose.model('book', bookSchema)