const mongoose = require('mongoose')
const Schema = mongoose.Schema

const orderSchema = new Schema(
  {
    user: { type: String, ref: 'User', required: true },
    products: [{ type: Schema.Types.ObjectId, ref: 'Product', required: true }],
    status: { type: String, enum: ['NEW', 'PICKUP', 'CLEANING', 'DROPOFF'], required: true },
    dropOffAddress: { type: String, required: true },
    pickUpAddress: { type: String, required: true },
    pickUpDate: { type: Date, required: true },
    dropOffDate: { type: Date, required: true },
    price: { type: String, required: true },
    addressDetails: { type: String, default: '' },
    addressDetails2: { type: String, default: '' },
    displayedId: { type: String, required: true },
    comment: { type: String, default: true },
    phoneNumber: { type: String, required: true }
  },

  {
    timestamps: true,
    autoCreate: true
  }
)

const OrderModel = mongoose.model('Order', orderSchema, 'orders')
module.exports = OrderModel
