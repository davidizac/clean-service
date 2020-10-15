const userService = require('../services/user.service')

class UserController {
  async createUser(req, res) {
    await userService.createUser(req.user.user_id, req.body)
    return res.status(200).send()
  }
}

module.exports = new UserController()
