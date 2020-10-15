const { Joi } = require('../../../helpers/joi-validator')

const createOrderValidator = Joi.object({
  products: Joi.array()
    .items(Joi.objectId())
    .required(),
  status: Joi.string()
    .valid('NEW', 'PENDING', 'DONE')
    .required(),
  takeOffAddress: Joi.string().required(),
  takeBackAddress: Joi.string().required(),
  takeOffDate: Joi.date().required(),
  takeBackDate: Joi.date().required(),
  comment: Joi.string()
    .allow('')
    .optional()
})

module.exports = {
  createOrderValidator
}
