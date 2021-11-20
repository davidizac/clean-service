const ejs = require('ejs')
const nodemailer = require('nodemailer')
const path = require('path')
const fs = require('fs')
const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: 'contact@cleeser.com',
        pass: 'linoyezra24'
    }
})

module.exports.sendWelcomeEmail = async email => {
    console.log('sendWelcomeEmail', email);
    const template = fs.readFileSync(path.join(__dirname, 'welcome.ejs'), 'utf-8')
    await transporter.sendMail({
        from: 'contact@cleeser.com',
        to: email,
        subject: 'Welcome to Cleeser !',
        html: ejs.render(template)
    })
}

module.exports.sendOrderConfirmation = async email => {
    const template = fs.readFileSync(path.join(__dirname, 'order-confirmation.ejs'), 'utf-8')

    await transporter.sendMail({
        from: 'contact@cleeser.com',
        to: email,
        subject: 'Confirmation of your order',
        html: ejs.render(template)
    })
}