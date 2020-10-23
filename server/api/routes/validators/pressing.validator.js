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
  createPressingValidator
  // getAllPressingValidator
}
