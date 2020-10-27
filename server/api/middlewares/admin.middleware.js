const AccessDeniedError = require('../errors/access-denied')
const UserModel = require('../models/user.model')

module.exports = async function isAdmin(req, res, next) {
  const user = await UserModel.findById(req.user.user_id)
  if (!user?.isAdmin) {
    throw new AccessDeniedError()
  }
  return next()
}
