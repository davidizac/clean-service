const PressingModel = require('../models/pressing.model')
const geolib = require('geolib')
const ProductModel = require('../models/product.model')
const pageSize = process.env.PAGE_SIZE

class PressingService {
  async createPressing(pressingData) {
    const products = pressingData.products
    delete pressingData.products
    const pressing = new PressingModel(pressingData)
    await pressing.save()
    await ProductModel.insertMany(products)
  }

  async getAll(params) {
    const offset = params.page * pageSize - pageSize
    let pressings = await PressingModel.find()

    if (params.coordinates) {
      const coordinates = geolib.orderByDistance(
        JSON.parse(params.coordinates),
        pressings.map(p => {
          return { latitude: p.latitude, longitude: p.longitude }
        })
      )

      pressings = coordinates.map(c => {
        return pressings.find(p => p.latitude === c.latitude && p.longitude === c.longitude)
      })
    }

    pressings = pressings.splice(offset, pageSize)

    return pressings
  }

  async getById(id) {
    const pressing = await PressingModel.findById(id)
    const products = await ProductModel.find({ pressindId: pressing.id })

    return Object.assign(pressing, products)
  }
}

module.exports = new PressingService()
