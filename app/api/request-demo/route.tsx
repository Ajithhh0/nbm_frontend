import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function POST(req: Request) {
  const { name, email } = await req.json();

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_APP_PASSWORD,
    },
  });

  await transporter.sendMail({
    from: `"NeuroBiomark Demo" <${process.env.GMAIL_USER}>`,
    to: "ajithvn01@gmail.com",
    subject: "New Demo Request",
    html: `
      <h3>New Demo Request</h3>
      <p><strong>Name:</strong> ${name}</p>
      <p><strong>Email:</strong> ${email}</p>
    `,
  });

  return NextResponse.json({ success: true });
}
