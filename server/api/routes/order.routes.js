const express = require('express')
const router = new express.Router()

const orderController = require('../controllers/order.controller')
const { validator } = require('../../helpers/joi-validator')
const { createOrderValidator, updateOrderStatusValidator } = require('./validators/order.validator')
const authMiddleware = require('../middlewares/auth.middleware')
const adminMiddleware = require('../middlewares/admin.middleware')
const { IdParamsValidator } = require('./validators/shared.validator')

router.post('/', authMiddleware, validator.body(createOrderValidator), orderController.createOrder)
router.get('/', authMiddleware, orderController.getMyOrders)
router.get('/admin', authMiddleware, adminMiddleware, orderController.getAll)
router.get('/:id', authMiddleware, validator.params(IdParamsValidator), orderController.getOrder)
router.put('/:id', authMiddleware, validator.body(createOrderValidator), orderController.updateOrder)
router.put(
  '/:id/admin',
  authMiddleware,
  adminMiddleware,
  validator.body(updateOrderStatusValidator),
  orderController.updateOrderStatus
)

module.exports = router
