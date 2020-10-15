const winston = require('winston')

const { inspect } = require('util')

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(winston.format.colorize(), winston.format.json()),
  colorize: true,
  transports: []
})

const logFormat = winston.format.printf(function(info) {
  const date = new Date().toISOString()
  return `${date}-${info.level}: ${inspect(info.message)}\n`
})

if (process.env.NODE_ENV === 'production') {
  logger.add(
    new winston.transports.Console({
      level: 'error',
      format: winston.format.combine(winston.format.colorize(), logFormat)
    })
  )
} else {
  logger.add(
    new winston.transports.Console({
      level: 'debug',
      format: winston.format.combine(winston.format.colorize(), logFormat)
    })
  )
}

// Override the base console log with winston
console.log = function(...args) {
  return logger.info(args)
}
console.error = function(...args) {
  return logger.error(args)
}
console.warn = function(...args) {
  return logger.warn(args)
}

module.exports = logger
