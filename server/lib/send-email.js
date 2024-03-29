const ejs = require('ejs')
const nodemailer = require('nodemailer')
const path = require('path')
const fs = require('fs')
const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  service: 'gmail',
  port: 465,
  secure: true,
  auth: {
    user: 'contact@cleeser.com',
    pass: 'isomena26'
  }
})

module.exports.sendWelcomeEmail = async email => {
  const template = fs.readFileSync(path.join(__dirname, 'welcome.ejs'), 'utf-8')

  await transporter.sendMail({
    from: 'Cleeser <contact@cleeser.com',
    to: email,
    subject: 'Bienvenue chez Cleeser !',
    html: ejs.render(template)
  })
}

module.exports.sendOrderConfirmation = async email => {
  const template = fs.readFileSync(path.join(__dirname, 'order-confirmation.ejs'), 'utf-8')

  await transporter.sendMail({
    from: 'Cleeser <contact@cleeser.com',
    to: email,
    subject: 'Confirmation de votre commande',
    html: ejs.render(template)
  })
}
