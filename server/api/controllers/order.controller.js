const orderService = require('../services/order.service')

class OrderController {
  async createOrder(req, res) {
    await orderService.createOrder(req.user.user_id, req.body)
    return res.status(200).send()
  }

  async getAll(req, res) {
    const orders = await orderService.getAll()
    return res.json(orders)
  }
}

module.exports = new OrderController()
