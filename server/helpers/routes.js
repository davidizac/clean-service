const userApi = require('../api/routes/user.routes')
const pressingApi = require('../api/routes/pressing.routes')
const orderApi = require('../api/routes/order.routes')
const { exec } = require('child_process')
const path = require('path')

module.exports = function bootstrapApi(app) {
  app.use('/api/users/', userApi)
  app.use('/api/pressings/', pressingApi)
  app.use('/api/orders/', orderApi)
  app.get('github', (req, res) => {
    exec(`sh ${path.join(__dirname, 'ci.sh')}`, function(error, stdout, stderr) {
      console.log('stdout: ' + stdout)
      console.log('stderr: ' + stderr)
      if (error !== null) {
        console.log('exec error: ' + error)
      }
    })
  })
}
