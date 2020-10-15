const mongoose = require('mongoose')
const validator = require('validator')
const Schema = mongoose.Schema

const userSchema = new Schema(
  {
    _id: { type: String, required: true, unique: true, index: true },
    name: { type: String, required: true },
    email: {
      type: String,
      required: true,
      unique: true,
      index: true,
      validate: validator.isEmail
    },
    phoneNumber: { type: String },
    isAdmin: { type: Boolean, default: false }
  },

  {
    timestamps: true,
    autoCreate: true
  }
)

const UserModel = mongoose.model('User', userSchema, 'users')
module.exports = UserModel
