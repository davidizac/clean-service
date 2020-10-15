const UserModel = require('../models/user.model')

class UserService {
  async createUser(userId, userData) {
    userData._id = userId
    const user = new UserModel(userData)
    const savedUser = await user.save()
    return savedUser
  }

  async setUserAsAdmin(email) {
    return UserModel.updateOne({ email }, { $set: { isAdmin: true } })
  }
}

module.exports = new UserService()
