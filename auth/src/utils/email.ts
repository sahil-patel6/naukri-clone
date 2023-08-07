import nodemailer from "nodemailer";
import Mail from "nodemailer/lib/mailer";

const createTransporter = async () => {

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth:{
      user: process.env.EMAIL,
      pass: process.env.EMAIL_APP_PASSWORD
    }
  })
  
  return transporter;
};

const sendEmail = async (emailOptions: Mail.Options) => {
  let emailTransporter = await createTransporter();
  emailTransporter.sendMail(emailOptions, function (error, info) {
    if (error) {
      console.log(error);
    } else {
      console.log('Email sent: ' + info.response);
    }
  });
};

export {
  sendEmail
}