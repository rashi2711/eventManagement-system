const nodemailer = require('nodemailer');

const mailSender = async (email, title, body) => {
  try {
    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const info = await transporter.sendMail({
      from: `"Event Management System" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: title,
      html: body,
    });

    console.log('Email sent:', info.messageId);
    return info;
  } catch (error) {
    console.error('Mail sender error:', error);
    throw error;
  }
};

module.exports = mailSender;