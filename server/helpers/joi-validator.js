const { createValidator } = require('express-joi-validation')
const Joi = require('@hapi/joi')
Joi.objectId = () => Joi.string().regex(/^[0-9a-fA-F]{24}$/)

const validator = createValidator({})

module.exports = {
  Joi,
  validator
}
