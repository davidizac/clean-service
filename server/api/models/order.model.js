const mongoose = require('mongoose')
const Schema = mongoose.Schema

const orderSchema = new Schema(
  {
    userId: { type: String, ref: 'User' },
    products: [{ type: Schema.Types.ObjectId, ref: 'Product' }],
    status: { type: String, enum: ['NEW', 'PENDING', 'DONE'] },
    takeOffAddress: { type: String },
    takeBackAddress: { type: String },
    takeOffDate: { type: Date },
    takeBackDate: { type: Date },
    comment: { type: String }
  },

  {
    timestamps: true,
    autoCreate: true
  }
)

const OrderModel = mongoose.model('Order', orderSchema, 'orders')
module.exports = OrderModel
