const AccessDeniedError = require('../errors/access-denied')
const orderService = require('../services/order.service')
const moment = require('moment')
const userService = require('../services/user.service')
const { sendOrderConfirmation } = require('../../lib/send-email')
class OrderController {
    async createOrder(req, res) {
        const order = await orderService.createOrder(req.user.user_id, req.body)
        const adminUsers = await userService.getAdminUsers()
        const emails = [...adminUsers.map(u => u.email), req.user.email]
        Promise.all(emails.map(sendOrderConfirmation))
        return res.json(order)
    }

    async getAll(req, res) {
        const orders = await orderService.getAll()
        return res.json(orders)
    }

    async getMyOrders(req, res) {
        const orders = await orderService.getMyOrders(req.user.user_id)
        return res.json(orders)
    }

    async getOrder(req, res) {
        const isAdmin = await userService.isAdmin(req.user.user_id)
        const order = await orderService.getOrder(req.user.user_id, req.params.id, isAdmin)
        if (!order) {
            return res.status(404).send()
        }
        return res.json(order)
    }

    async updateOrder(req, res) {
        if (!isAbleToUpdate(req.body)) {
            throw new AccessDeniedError('Order must be updated 3 hours before pickup time')
        }
        const orders = await orderService.updateOrder(req.user.user_id, req.params.id, req.body)
        return res.json(orders)
    }

    async updateOrderStatus(req, res) {
        const orders = await orderService.updateOrderStatus(req.params.id, req.body)
        return res.json(orders)
    }
}

function isAbleToUpdate(order) {
    if (order.status === 'NEW') {
        return moment(order.pickUpDate)
            .subtract(3, 'hours')
            .isAfter(moment())
    }
    return false
}

module.exports = new OrderController()