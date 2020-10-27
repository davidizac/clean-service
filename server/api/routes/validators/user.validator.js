const { Joi } = require('../../../helpers/joi-validator')

const createUserValidator = Joi.object({
  fullname: Joi.string().required(),
  email: Joi.string().required()
})

module.exports = {
  createUserValidator
}
