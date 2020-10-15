const AccessDeniedError = require('../errors/access-denied')
const UserModel = require('../models/user.model')

module.exports = async function isAdmin(req, res, next) {
  try {
    const user = await UserModel.findById(req.user.user_id)
    if (!user.isAdmin) {
      return new AccessDeniedError()
    }
    return next()
  } catch (err) {
    throw new Error('Failed during the is admin middleware', err)
  }
}
