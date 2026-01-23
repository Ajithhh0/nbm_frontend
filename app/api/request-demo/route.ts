import { NextResponse } from "next/server";
import { z } from "zod";
import { transporter } from "@/lib/mailSender";


import { connectDB } from "@/lib/mongodb";
import DemoRequest from "@/models/DemoRequest";
import { verifyTurnstile } from "@/lib/verifyTurnstile";
import { syncToGoogleSheets } from "@/lib/googleSheets";

const Schema = z.object({
  name: z.string().min(2).max(80),
  email: z.string().email().max(120),
  captchaToken: z.string(),
  purpose: z.string().min(30).max(1000),
});

export async function POST(req: Request) {
  try {
    await connectDB();

    const body = await req.json();
    console.log("REQUEST BODY >>>", body);

    const parsed = Schema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid input" }, { status: 400 });
    }

    //  EXTRACT ALL FIELDS HERE
    const { name, email, purpose, captchaToken } = parsed.data;

    const ip =
      req.headers.get("x-forwarded-for") ||
      req.headers.get("x-real-ip") ||
      "unknown";

    //  CAPTCHA — PROD ONLY
    if (process.env.NODE_ENV === "production") {
      if (!captchaToken) {
        return NextResponse.json(
          { error: "Captcha missing" },
          { status: 403 }
        );
      }

      const captchaOk = await verifyTurnstile(captchaToken, String(ip));
      if (!captchaOk) {
        return NextResponse.json(
          { error: "Captcha failed" },
          { status: 403 }
        );
      }
    }

    //  Anti-spam (24h)
    const exists = await DemoRequest.findOne({
      email,
      createdAt: { $gte: new Date(Date.now() - 24 * 60 * 60 * 1000) },
    });

    if (exists) {
      return NextResponse.json(
        { error: "Already requested recently" },
        { status: 429 }
      );
    }

    //  Save to MongoDB
    const doc = await DemoRequest.create({ name, email, ip });

    //  Email notification
    // const transporter = nodemailer.createTransport({
    //   service: "gmail",
    //   auth: {
    //     user: process.env.GMAIL_USER,
    //     pass: process.env.GMAIL_APP_PASSWORD,
    //   },
    // });

  console.log("PURPOSE >>>", purpose);

  console.log("MAIL TO =", process.env.MAIL_FROM);


await transporter.sendMail({
  envelope: {
    from: process.env.MAIL_USER!,
    to: [process.env.MAIL_FROM!],
  },
  from: `"NeuroBiomark - Demo Request Handler " <${process.env.MAIL_FROM}>`,
  to: process.env.MAIL_FROM,
  replyTo: email,
  subject: "New Demo Request",
  html: `
    <h3>New Demo Request</h3>
    <p><b>Name:</b> ${name}</p>
    <p><b>Email:</b> ${email}</p>
    <p><b>Purpose:</b></p>
    <p>${purpose}</p>
    <hr />
    <p><small>IP: ${ip}</small></p>
  `,
});



    //  Google Sheets (non-blocking)
    syncToGoogleSheets([
      name,
      email,
      String(ip),
      doc.createdAt.toISOString(),
    ]).catch(console.error);

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Server error" },
      { status: 500 }
    );
  }
}
