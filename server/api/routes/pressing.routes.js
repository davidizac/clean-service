const express = require('express')
const router = new express.Router()
const { validator } = require('../../helpers/joi-validator')

const pressingController = require('../controllers/pressing.controller')
const adminMiddleware = require('../middlewares/admin.middleware')
const authMiddleware = require('../middlewares/auth.middleware')
const { createPressingValidator, getAllPressingValidator } = require('./validators/pressing.validator')
const { IdParamsValidator } = require('./validators/shared.validator')

router.post(
  '/',
  authMiddleware,
  adminMiddleware,
  validator.body(createPressingValidator),
  pressingController.createPressing
)
router.get('/', validator.body(getAllPressingValidator), pressingController.getAll)
router.get('/:id', validator.params(IdParamsValidator), pressingController.getPressing)

module.exports = router
