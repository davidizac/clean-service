const OrderModel = require('../models/order.model')

class OrderService {
  async createOrder(userId, orderData) {
    orderData.userId = userId
    const order = new OrderModel(orderData)
    return order.save()
  }

  async getAll() {
    return OrderModel.find()
  }
}

module.exports = new OrderService()
