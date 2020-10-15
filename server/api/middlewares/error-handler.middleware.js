const ValidationError = require('../errors/validation')
const AccessDeniedError = require('../errors/access-denied')

module.exports = logger => {
  // if (!tokensService) throw new Error('missing tokenService')
  // const { InvalidTokenError, TokenExpiredError } = tokensService

  return (err, req, res, next) => {
    const log = req.log || logger
    let logLevel = 'error'
    let msg = 'error while trying to handle request'
    let statusCode

    if (err instanceof ValidationError || err.name === 'ValidationError') {
      msg = 'validation error'
      statusCode = 400
    }

    if (err instanceof AccessDeniedError) {
      msg = 'permission denied'
      logLevel = 'warn'
      statusCode = 403
    }

    // if (err instanceof InvalidTokenError || err instanceof TokenExpiredError) {
    //   msg = 'permission denied, relogin required'
    //   logLevel = 'warn'
    //   statusCode = 401
    // }

    log[logLevel](err, msg)
    res.status(statusCode || 500).end()
  }
}
