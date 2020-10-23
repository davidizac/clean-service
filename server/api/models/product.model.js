const mongoose = require('mongoose')
const Schema = mongoose.Schema

const productSchema = new Schema(
  {
    pressingId: { type: Schema.Types.ObjectId, ref: 'Pressing', required: true },
    price: { type: Number, required: true },
    category: { type: String, enum: global.cleanService.CATEGORIES, required: true },
    name: { type: String }
  },

  {
    timestamps: true,
    autoCreate: true
  }
)

const ProductModel = mongoose.model('Product', productSchema, 'products')
module.exports = ProductModel
