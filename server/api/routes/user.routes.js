const express = require('express')
const router = new express.Router()
const { validator } = require('../../helpers/joi-validator')

const userController = require('../controllers/user.controller')
const authMiddleware = require('../middlewares/auth.middleware')
const { createUserValidator } = require('./validators/user.validator')

router.post('/', authMiddleware, validator.body(createUserValidator), userController.createUser)

module.exports = router
