const { Joi } = require('../../../helpers/joi-validator')

const createPressingValidator = Joi.object({
  name: Joi.objectId().required(),
  address: Joi.string().required(),
  latitude: Joi.string().required(),
  longitude: Joi.string().required(),
  city: Joi.string().required(),
  phoneNumber: Joi.string()
    .allow('')
    .optional()
})

const getAllPressingValidator = {
  coordinates: Joi.object({
    latitude: Joi.string().required(),
    longitude: Joi.string().required()
  }),
  page: Joi.number()
    .min(1)
    .required()
}

module.exports = {
  createPressingValidator,
  getAllPressingValidator
}
