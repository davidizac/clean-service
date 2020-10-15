require('dotenv').config({ path: require('path').join(__dirname, '.env') })
const startCleanService = require('./helpers')

startCleanService()
