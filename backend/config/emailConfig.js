import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS } = process.env;

// Declare & export in one go
export const EMAIL_FROM = process.env.EMAIL_FROM || "noreply@mmdu.edu.in";

let transporter = null;

if (!SMTP_HOST || !SMTP_PORT || !SMTP_USER || !SMTP_PASS) {
  console.warn("SMTP configuration is missing. Emails will not be sent.");
} else {
  transporter = nodemailer.createTransport({
    host: SMTP_HOST,
    port: Number(SMTP_PORT),
    secure: String(SMTP_PORT) === "465",
    auth: {
      user: SMTP_USER,
      pass: SMTP_PASS,
    },
  });
}

export { transporter };
export default transporter;

