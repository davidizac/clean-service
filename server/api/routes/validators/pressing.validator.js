const { Joi } = require('../../../helpers/joi-validator')

const createPressingValidator = Joi.object({
  name: Joi.string().required(),
  address: Joi.string().required(),
  latitude: Joi.string().required(),
  longitude: Joi.string().required(),
  phoneNumber: Joi.string()
    .allow('')
    .optional(),
  products: Joi.array().items(
    Joi.object({
      _id: Joi.string()
        .allow('')
        .optional(),
      pressingId: Joi.string()
        .allow('')
        .optional(),
      price: Joi.string(),
      category: Joi.string(),
      name: Joi.string()
    })
  )
})

const updatePressingValidator = Joi.object({
  _id: Joi.allow('').optional(),
  name: Joi.string().required(),
  address: Joi.string().required(),
  latitude: Joi.allow('').optional(),
  longitude: Joi.allow('').optional(),
  phoneNumber: Joi.string()
    .allow('')
    .optional(),
  products: Joi.array().items(
    Joi.object({
      _id: Joi.string()
        .allow('')
        .optional(),
      pressingId: Joi.string()
        .allow('')
        .optional(),
      price: Joi.string(),
      category: Joi.string(),
      name: Joi.string()
    })
  )
})
// const getAllPressingValidator = {
//   coordinates: Joi.object({
//     latitude: Joi.string().required(),
//     longitude: Joi.string().required()
//   }),
//   page: Joi.number()
//     .min(1)
//     .required()
// }

module.exports = {
  createPressingValidator,
  updatePressingValidator
}
