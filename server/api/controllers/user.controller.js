const { sendWelcomeEmail } = require('../../lib/send-email')
const userService = require('../services/user.service')

class UserController {
  async createUser(req, res) {
    await userService.createUser(req.user.user_id, req.body)
    const adminUsers = await userService.getAdminUsers()
    const emails = [...adminUsers.map(u => u.email), req.body.email]
    await Promise.all(emails.map(sendWelcomeEmail))
    return res.status(200).send()
  }

  async isAdmin(req, res) {
    const isAdmin = await userService.isAdmin(req.user.user_id)
    return res.send(isAdmin)
  }

  async getMe(req, res) {
    const user = await userService.getUser(req.user.user_id)
    return res.send(user)
  }

  async getAll(req, res) {
    return res.json(await userService.getAll())
  }
}

module.exports = new UserController()
