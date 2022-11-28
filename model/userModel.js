const mongoose = require('mongoose')

const userModel = new mongoose.Schema(
  {
    title: {
      type: String,
      require: true,
      enum: ["Mr", "Mrs", "Miss"]
    },
    name: {
      type: String,
      require: true,
      trim: true
    },
    phone: {
      type: String,
      require: true,
      unique: true
    },
    email: {
      type: String,
      require: true,
      unique: true,
      lowercase: true
    },
    password: {
      type: String,
      require: true
    },
    address: {
      street: {
        type: String,
        trim: true
      },
      city: {
        type: String,
        trim: true
      },
      pincode: { type: String }
    }
  }, { timestamps: true })


module.exports = mongoose.model('user', userModel)