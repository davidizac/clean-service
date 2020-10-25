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

  async isAdmin(userId) {
    const user = await UserModel.findById(userId)
    return user.isAdmin
  }

  async getUser(userId) {
    return UserModel.findById(userId)
  }

  async getAdminUsers() {
    return UserModel.find({ isAdmin: true }).lean()
  }

  async getAll() {
    return UserModel.find().lean()
  }
}

module.exports = new UserService()
