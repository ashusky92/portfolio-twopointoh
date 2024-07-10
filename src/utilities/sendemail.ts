import { MailtrapClient } from "mailtrap";

const TOKEN = import.meta.env.MAILTRAP_TOKEN;
const SENDER_EMAIL = import.meta.env.SENDGRID_SENDER_EMAIL;
const NOTIFICATION_EMAIL = import.meta.env.SENDGRID_NOTIFICATION_EMAIL;

const client = new MailtrapClient({
  token: TOKEN,
});

export function notifyMailTrap(request, subject = "Notification!") {
  const { name, email, phone, message } = request;

  const sender = {
    email: SENDER_EMAIL,
    name: "Portfolio Notify",
  };

  const recipients = [
    {
      email: NOTIFICATION_EMAIL,
    },
  ];

  client
    .send({
      from: sender,
      to: recipients,
      subject: subject,
      html: `<h1>Submission from Contact Form!</h1>\n\n<h2>Name</h2>\n<p>${name}</p>\n\n<h2>Email</h2>\n<p>${email}</p>\n\n<h2>Phone</h2>\n<p>${
        phone ? phone : "No Number Entered"
      }</p>\n\n<h2>Message</h2>\n<p>${message}</p>`,
      category: "Notification Emails",
    })
    .then(console.log, console.error);
}

export default function sendMailTrap(request) {
  const { name, email, phone, message } = request;

  const sender = {
    email: SENDER_EMAIL,
    name: "Alex Husky",
  };
  const recipients = [
    {
      email: email,
    },
  ];

  client
    .send({
      from: sender,
      to: recipients,
      template_uuid: "23145983-7ad2-4ecb-b3d5-899752269d64",
      template_variables: {},
    })
    .then(console.log, console.error);
}
