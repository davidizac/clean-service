const express = require('express')
const router = new express.Router()

const orderController = require('../controllers/order.controller')
const { validator } = require('../../helpers/joi-validator')
const { createOrderValidator } = require('./validators/order.validator')
const authMiddleware = require('../middlewares/auth.middleware')
const adminMiddleware = require('../middlewares/admin.middleware')

router.post('/', authMiddleware, validator.body(createOrderValidator), orderController.createOrder)
router.get('/', authMiddleware, adminMiddleware, orderController.getAll)

module.exports = router
