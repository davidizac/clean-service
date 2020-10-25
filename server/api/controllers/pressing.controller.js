const pressingService = require('../services/pressing.service')

class PressingController {
  async createPressing(req, res) {
    await pressingService.createPressing(req.body)
    return res.status(200).send()
  }

  async getAll(req, res) {
    const pressings = await pressingService.getAll(req.query)
    return res.json(pressings)
  }

  async getPressing(req, res) {
    const pressing = await pressingService.getById(req.params.id)
    return res.json(pressing)
  }

  async deletePressing(req, res) {
    await pressingService.delete(req.params.id)
    return res.status(200).send()
  }
}

module.exports = new PressingController()
