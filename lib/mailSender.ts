import nodemailer from "nodemailer";

const {
  SMTP_HOST,
  SMTP_PORT,
  SMTP_SECURE,
  MAIL_USER,
  MAIL_PASSWORD,
} = process.env;

if (!SMTP_HOST || !SMTP_PORT || !MAIL_USER || !MAIL_PASSWORD) {
  throw new Error("❌ Missing required mail environment variables");
}

export const transporter = nodemailer.createTransport({
  host: SMTP_HOST,
  port: Number(SMTP_PORT),
  secure: SMTP_SECURE === "true",
  auth: {
    user: MAIL_USER,        // ✅ FIXED
    pass: MAIL_PASSWORD,
  },
});

console.log("MAIL CONFIG CHECK", {
  SMTP_HOST: !!SMTP_HOST,
  SMTP_PORT: !!SMTP_PORT,
  MAIL_USER: !!MAIL_USER,
  MAIL_PASSWORD: !!MAIL_PASSWORD,
});
