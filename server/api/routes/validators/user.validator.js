const { Joi } = require('../../../helpers/joi-validator')

const createUserValidator = Joi.object({
  fullname: Joi.string().required(),
  email: Joi.string().required(),
  phoneNumber: Joi.string()
    .allow('')
    .optional()
})

module.exports = {
  createUserValidator
}
