const mongoose = require('mongoose')
const Schema = mongoose.Schema

const pressingSchema = new Schema(
  {
    name: { type: String, required: true },
    address: { type: String, required: true },
    latitude: { type: String, required: true },
    longitude: { type: String, required: true },
    phoneNumber: { type: String, required: true }
  },

  {
    timestamps: true,
    autoCreate: true
  }
)

const PressingModel = mongoose.model('Pressing', pressingSchema, 'pressings')
module.exports = PressingModel
