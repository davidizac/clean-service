const PressingModel = require('../models/pressing.model')
// const geolib = require('geolib')
const ProductModel = require('../models/product.model')
// const pageSize = process.env.PAGE_SIZE

class PressingService {
  async createPressing(pressingData) {
    const products = pressingData.products
    delete pressingData.products
    const pressing = new PressingModel(pressingData)
    products.forEach(product => (product.pressingId = pressing._id))
    await pressing.save()
    await ProductModel.insertMany(products)
  }

  async getAll(params) {
    // const offset = params.page * pageSize - pageSize
    return PressingModel.find()

    // if (params.coordinates) {
    //   const coordinates = geolib.orderByDistance(
    //     JSON.parse(params.coordinates),
    //     pressings.map(p => {
    //       return { latitude: p.latitude, longitude: p.longitude }
    //     })
    //   )

    //   pressings = coordinates.map(c => {
    //     return pressings.find(p => p.latitude === c.latitude && p.longitude === c.longitude)
    //   })
    // }

    // pressings = pressings.splice(offset, pageSize)

    // return pressings
  }

  async delete(pressingId) {
    return PressingModel.deleteOne({ _id: pressingId })
  }

  async getById(id) {
    const pressing = await PressingModel.findById(id).lean()
    const products = await ProductModel.find({ pressingId: pressing._id }).lean()
    pressing.products = products
    return pressing
  }
}

module.exports = new PressingService()
