const mongoose = require('mongoose')

const ObjectId = mongoose.Schema.Types.ObjectId

const reviewSchema = new mongoose.Schema(
    {
        bookId: {
            type: ObjectId,
            required: true,
            ref: 'book'
        },
        reviewedBy: {
            type: String,
            required: true,
            default: 'Guest',
            value: String,
            trim: true
        },
        reviewedAt: {
            type: String,
            required: true,
            format: "date"
            
        },
        rating: {
            type: Number,
            required: true
        },
        review: {
            type: String,
            trim: true
        },
        isDeleted: {
            type: Boolean,
            default: false
        }
    }, { timestamps: true }
)

module.exports = mongoose.model('review', reviewSchema)