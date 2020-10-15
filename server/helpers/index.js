require('express-async-errors')
require('./set-globals').setGlobals()
const path = require('path')
const http = require('http')
const winston = require('winston')
const express = require('express')
const bodyParser = require('body-parser')
const expressWinston = require('express-winston')
const parseArgs = require('minimist')(process.argv.slice(2))
const socketService = require('../api/services/socket.service')
const bootstrapApi = require('./routes')
const setupDB = require('./database')
const logger = require('./logger')
const redirectToHTTPS = require('express-http-to-https').redirectToHTTPS
const errorsHandler = require('../api/middlewares/error-handler.middleware')

module.exports = async function startCleanService() {
  const app = express()

  const expressWinstonTranports = [
    new winston.transports.Console({
      json: false,
      colorize: true
    })
  ]

  if (process.env.NODE_ENV === 'production') {
    app.use(redirectToHTTPS())
  }

  app.use(
    expressWinston.logger({
      winstonInstance: logger,
      transports: expressWinstonTranports
    })
  )

  const port = parseArgs.PORT || process.env.PORT
  const server = http.createServer(app)
  const io = socketService.init(server)

  // enable cors
  app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*')
    res.header('Access-Control-Allow-Methods', 'PUT, GET, POST, DELETE, OPTIONS, PATCH')
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization')
    res.header('Access-Control-Allow-Credentials', true)
    res.header('Access-Control-Expose-Headers', 'Authorization')
    if (req.method === 'OPTIONS') {
      return res.sendStatus(200)
    }
    next()
  })

  try {
    await setupDB()
  } catch (error) {
    console.error('Error starting cleanService: error setting up the database.')
    process.exit()
  }

  app.use(
    bodyParser.urlencoded({
      extended: false
    })
  )
  app.use(bodyParser.json())

  app.use((req, res, next) => {
    req.io = io
    req.app = app
    next()
  })

  // Angular dist output folder
  app.use(express.static(path.join(__dirname, '../dist')))

  bootstrapApi(app)

  app.set('port', port)
  app.io = io

  // respond with 404 for unrecognized api routes
  app.all('/api/*', (req, res) => {
    res.status(404).send('Route not found.')
  })

  // Send all other requests to the Angular app
  app.all('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../dist', 'index.html'))
  })

  app.use(errorsHandler(logger))

  server.listen(port, () => {
    console.log(`Running on localhost:${port}`)
  })

  return server
}
