import { NextResponse } from "next/server";
import { transporter } from "@/lib/mailSender";

interface ContactRequestBody {
  userEmail: string;
  message: string;
}

export async function POST(req: Request): Promise<NextResponse> {
  try {
    const body: unknown = await req.json();

    if (
      typeof body !== "object" ||
      body === null ||
      !("userEmail" in body) ||
      !("message" in body)
    ) {
      return NextResponse.json(
        { success: false, error: "Invalid request body" },
        { status: 400 }
      );
    }

    const { userEmail, message } = body as ContactRequestBody;

    await transporter.sendMail({
      from: `"NeuroBiomark" <${process.env.MAIL_EMAIL!}>`,
      to: process.env.MAIL_EMAIL!,
      subject: "New Contact Form Submission",
      text: `From: ${userEmail}\n\nMessage:\n${message}`,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Mail error:", error);
    return NextResponse.json(
      { success: false },
      { status: 500 }
    );
  }
}
