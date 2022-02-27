const OrderModel = require('../models/order.model')
const { getPressingByProduct } = require('./pressing.service')

class OrderService {
    async createOrder(userId, orderData) {
        orderData.user = userId
        orderData.displayedId = `IL-2020-${generateNumber()}`
        const order = new OrderModel(orderData)
        await order.save()
        return order
    }

    async getAll() {
        const orders = await OrderModel.find()
            .sort({ createdAt: -1 })
            .populate({ path: 'products' })
            .populate({ path: 'user' })
            .lean()
        for (const order of orders) {
            if (order.products[0]) {
                const pressing = await getPressingByProduct(order.products[0])
                order.pressing = pressing.name
            } else {
                order.pressing = ''
            }
        }
        return orders
    }

    async getMyOrders(user) {
        return OrderModel.find({ user })
            .populate({ path: 'products' })
            .sort({ createdAt: -1 })
            .lean()
    }

    async getOrder(user, orderId, isAdmin) {
        const filter = { _id: orderId }
        if (!isAdmin) {
            filter.user = user
        }
        return OrderModel.findOne(filter)
            .populate({ path: 'products' })
            .lean()
    }

    async updateOrder(user, orderId, order) {
        order.user = user
        return OrderModel.findOneAndUpdate({ _id: orderId }, {
            $set: order
        }, { returnOriginal: false }).lean()
    }

    async updateOrderStatus(orderId, order) {
        order.user = order.user._id
        return OrderModel.findOneAndUpdate({ _id: orderId }, {
            $set: {
                status: order.status
            }
        }, { returnOriginal: false }).lean()
    }
}

function generateNumber() {
    return Math.floor(Math.random() * 9000) + 1000
}

module.exports = new OrderService()