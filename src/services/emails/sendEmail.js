import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";
import { emailTemplate } from "./emailTemplate.js";

const sendEmail = async (email) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_NAME,
      pass: process.env.EMAIL_PASS,
    },  
  });

  let token = jwt.sign({ email }, process.env.JWT_KEY);

  const info = await transporter.sendMail({
    from: ` 'Mazen Sherif' <${process.env.EMAIL_NAME}>`, //sender adress
    to: email, //list of recivers
    subject: "Hello", //subject line
    html: emailTemplate(token), //html body
  });
  console.log("Message sent: %s", info.messageId);
};

export default sendEmail;
