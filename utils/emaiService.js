const nodemailer = require('nodemailer');

const sendEmail = async ({to, subject, html}) => {
  // 1) Create a transporter
  const transporter = nodemailer.createTransport({
    service: 'GMail',
    host:"smtp.gmail.com",
    auth: {
      user: process.env.MAIL_USERNAME,
      pass: process.env.MAIL_PASSWORD,
    },
    
  });

  // 2) Define the email options
  const mailOptions = {
    from: 'Playpoint <noreply@playpoint.ai>',
    to: to,
    subject: subject,
    html: html,
  };

  // 3) Actually send the email
  await transporter.sendMail(mailOptions).catch(err=>console.log(err))
};

module.exports = sendEmail;