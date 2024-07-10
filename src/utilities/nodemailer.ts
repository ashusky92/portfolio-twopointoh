import nodemailer from "nodemailer";

var transport = nodemailer.createTransport({
  host: "live.smtp.mailtrap.io",
  port: parseInt(import.meta.env.MAILTRAP_PORT),
  auth: {
    user: import.meta.env.MAILTRAP_USER,
    pass: import.meta.env.MAILTRAP_PASS,
  },
});

export default function sendEmail2(request) {
  const { name, email, phone, message } = request;

  const mailOptions = {
    from: import.meta.env.SENDGRID_SENDER_EMAIL,
    to: email,
    subject: "Thank you for contact me!",
    text: `${name}, I will reach out as soon as possible!`,
  };

  transport.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log(error);
    } else {
      console.log("Email sent: " + info.response);
    }
  });
}
