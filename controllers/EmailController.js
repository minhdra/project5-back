const nodemailer = require('nodemailer');
const templateContact = require('../template/contactTemplate');
const templateVerify = require('../template/verifyTemplate');

class EmailController {
  // async..await is not allowed in global scope, must use a wrapper
  async sendMail(req, res) {
    let mailHost = 'smtp.gmail.com';
    let mailPort = 587;
    // create reusable transporter object using the default SMTP transport
    let transporter = nodemailer.createTransport(
      {
        host: mailHost,
        port: mailPort,
        secure: false, // nếu các bạn dùng port 465 (smtps) thì để true, còn lại hãy để false cho tất cả các port khác
        // service: 'gmail',
        auth: {
          user: process.env.EMAIL_USER, // generated ethereal user
          pass: process.env.EMAIL_PASS, // generated ethereal password
        },
      },
      {
        from: 'guest@gmail.com',
      }
    );

    // send mail with defined transport object
    await transporter
      .sendMail({
        from: req.body.email, // sender address
        to: process.env.EMAIL_TO, // list of receivers
        subject: `[${(new Date()).toLocaleDateString("en-US")}]-Need more information`, // Subject line
        // text: 'Hello world?', // plain text body
        html: templateContact(req.body), // html body
      })
      .then((data) => res.json(data))
      .catch((err) => res.json(err));
  }

  async verifyAccount(req, res) {
    let mailHost = 'smtp.gmail.com';
    let mailPort = 587;

    // create reusable transporter object using the default SMTP transport
    let transporter = nodemailer.createTransport(
      {
        host: mailHost,
        port: mailPort,
        secure: false, // nếu các bạn dùng port 465 (smtps) thì để true, còn lại hãy để false cho tất cả các port khác
        // service: 'gmail',
        auth: {
          user: process.env.EMAIL_USER, // generated ethereal user
          pass: process.env.EMAIL_PASS, // generated ethereal password
        },
      },
      {
        from: 'info.draco@gmail.com',
      }
    );

    // send mail with defined transport object
    await transporter
      .sendMail({

        from: `Draco <${process.env.EMAIL_USER}>`, // sender address
        to: req.body.email, // list of receivers
        subject: `Xác Minh Tài Khoản`, // Subject line
        // text: 'Hello world?', // plain text body
        html: templateVerify(req.body), // html body
      })
      .then((data) => res.json(data))
      .catch((err) => res.json(err));
  }
}

module.exports = new EmailController();
