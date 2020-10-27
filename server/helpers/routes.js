const userApi = require('../api/routes/user.routes')
const pressingApi = require('../api/routes/pressing.routes')
const orderApi = require('../api/routes/order.routes')

module.exports = function bootstrapApi(app) {
  app.use('/api/users/', userApi)
  app.use('/api/pressings/', pressingApi)
  app.use('/api/orders/', orderApi)
}
