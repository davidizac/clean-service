const { Joi } = require('../../../helpers/joi-validator')

const IdParamsValidator = Joi.object({
  id: Joi.objectId().required()
})

module.exports = {
  IdParamsValidator
}
