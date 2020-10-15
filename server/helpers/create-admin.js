require('dotenv').config({ path: require('path').join(__dirname, '../.env') })
const prompts = require('prompts')
const mongoose = require('mongoose')
const validator = require('validator')
const userService = require('../api/services/user.service')

function getPrompts() {
  return prompts([
    {
      type: 'text',
      name: 'email',
      message: 'What is your email?',
      validate: value => (validator.isEmail(value) ? true : `It's incorrect email format.`)
    }
  ])
}

async function createAdmin() {
  try {
    await mongoose.connect(process.env.DB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    })
    const { email } = await getPrompts()
    await userService.setUserAsAdmin(email)
    console.log('\x1b[35m', `User with email "${email}" is now an admin.`)
  } catch (error) {
    console.error(error)
  }
  mongoose.connection.close()
}

createAdmin()
