const express = require('express')
const router = new express.Router()
const { validator } = require('../../helpers/joi-validator')

const userController = require('../controllers/user.controller')
const adminMiddleware = require('../middlewares/admin.middleware')
const authMiddleware = require('../middlewares/auth.middleware')
const { createUserValidator } = require('./validators/user.validator')

router.get('/', authMiddleware, adminMiddleware, userController.getAll)
router.post('/', authMiddleware, validator.body(createUserValidator), userController.createUser)
router.get('/is-admin', authMiddleware, userController.isAdmin)
router.get('/me', authMiddleware, userController.getMe)

module.exports = router
