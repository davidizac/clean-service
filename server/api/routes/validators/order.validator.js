const { Joi } = require('../../../helpers/joi-validator')

const createOrderValidator = Joi.object({
  _id: Joi.string()
    .allow('')
    .optional(),
  user: Joi.string()
    .allow('')
    .optional(),
  products: Joi.array()
    .items(Joi.objectId())
    .required(),
  status: Joi.string()
    .valid('NEW', 'PICKUP', 'CLEANING', 'DROPOFF')
    .required(),
  displayedId: Joi.string(),
  dropOffAddress: Joi.string().required(),
  pickUpAddress: Joi.string().required(),
  pickUpDate: Joi.date().required(),
  dropOffDate: Joi.date().required(),
  price: Joi.string().required(),
  phoneNumber: Joi.string().required(),
  comment: Joi.string()
    .allow('')
    .optional(),
  addressDetails: Joi.string()
    .allow('')
    .optional(),
  addressDetails2: Joi.string()
    .allow('')
    .optional()
})
const updateOrderStatusValidator = Joi.object({
  _id: Joi.string()
    .allow('')
    .optional(),
  user: Joi.object()
    .allow({
      createdAt: Joi.string(),
      email: Joi.string(),
      fullname: Joi.string(),
      isAdmin: Joi.boolean(),
      updatedAt: Joi.string()
    })
    .optional(),
  products: Joi.array()
    .items(Joi.objectId())
    .required(),
  status: Joi.string()
    .valid('NEW', 'PICKUP', 'CLEANING', 'DROPOFF')
    .required(),
  displayedId: Joi.string(),
  dropOffAddress: Joi.string().required(),
  pickUpAddress: Joi.string().required(),
  pickUpDate: Joi.date().required(),
  dropOffDate: Joi.date().required(),
  price: Joi.string().required(),
  phoneNumber: Joi.string().required(),
  comment: Joi.string()
    .allow('')
    .optional(),
  addressDetails: Joi.string()
    .allow('')
    .optional(),
  addressDetails2: Joi.string()
    .allow('')
    .optional(),
  pressing: Joi.string()
    .allow('')
    .optional()
})

module.exports = {
  createOrderValidator,
  updateOrderStatusValidator
}
