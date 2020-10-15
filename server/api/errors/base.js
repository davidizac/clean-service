class BaseError extends Error {
  constructor(message, data) {
    super()
    this.message = message
    this.data = data
  }
}

module.exports = BaseError
