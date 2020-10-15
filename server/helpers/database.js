const mongoose = require('mongoose')

module.exports = async function setupDB() {
  try {
    await mongoose.connect(process.env.DB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    })
    console.log(`Successfully Connected to the MongoDB at ${process.env.DB_URI}`)
  } catch (err) {
    console.error('Error connecting to MongoDB: ', err)
    throw err
  }
}
