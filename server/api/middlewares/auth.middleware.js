const fbAdmin = require('firebase-admin')
const AccessDeniedError = require('../errors/access-denied')

fbAdmin.initializeApp({
  credential: fbAdmin.credential.cert(require('../../firebase-credentials.json'))
})

async function authMiddleware(req, res, next) {
  try {
    const user = await fbAdmin.auth().verifyIdToken(req.headers['authorization'])
    req.user = user
    next()
  } catch (err) {
    throw new AccessDeniedError()
  }
}

module.exports = authMiddleware
