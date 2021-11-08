const nodemailer = require('nodemailer');
let transporter = nodemailer.createTransport({
        host: 'smtp.mailtrap.io',
        port: 2525,
        auth: {
            user: "bcf9589758edbe",
            pass: "9fbb5e81cf4da5"
        }
})

const FROM = 'liventrous.sj@gmail.com'

exports.sendOtpEmail = async(req)=>{
    message = {
        from: FROM,
        to: req.to,
        subject: req.subject,
        text: req.body
   }
   await transporter.sendMail(message,function(err, info) {
        if (err) {
          console.log(err)
          return false
        } else {
          console.log(info);
          return true
        }
   })    
}