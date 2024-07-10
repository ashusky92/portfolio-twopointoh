import type { APIContext } from "astro";
import { MongoClient } from "mongodb";
import { isValidEmail } from "../../utilities/emailchecker";
import sendEmail2 from "../../utilities/nodemailer";
import sendMailTrap, { notifyMailTrap } from "../../utilities/sendemail";

export async function POST(context: APIContext): Promise<Response> {
  const formData = await context.request.formData();
  const name = formData.get("name");
  const email = formData.get("email");
  const phone = formData.get("phone");
  const comment = formData.get("comment");

  let errors = [];
  let errorMessage = "";

  console.log(
    `Name: ${formData.get("name")}\nEmail: ${formData.get(
      "email"
    )}\nPhone: ${formData.get("phone")}\nComment: ${formData.get("comment")}`
  );

  if (!name || typeof name !== "string") {
    errors.push('Missing "Name" value');
  }

  if (!email || typeof name !== "string") {
    errors.push('Missing "Email" value');
  }

  if (!isValidEmail) {
    errors.push("Email format is invalid");
  }

  if (!comment || typeof name !== "string") {
    errors.push('Missing "Message" value');
  }

  if (errors.length > 0) {
    errors.forEach((value, index) => {
      if (index == errors.length - 1) {
        errorMessage += value + ".";
      } else {
        errorMessage += value + ", ";
      }
    });
  }

  if (errorMessage) {
    return new Response(errorMessage, {
      status: 400,
    });
  }

  const request = {
    name: name,
    email: email,
    phone: phone,
    message: comment,
    status: "unread",
  };

  notifyMailTrap(request, "Contact Form Submission!");
  sendMailTrap(request);

  const client = new MongoClient(import.meta.env.MONGODB_CONNECTION);
  const db = client.db("portfoliodb");
  const leads = db.collection("Leads");
  const submissionDate = new Date();

  leads.insertOne({
    ...request,
    submission_date: submissionDate,
  });

  return context.redirect("/forms/contact");
}
