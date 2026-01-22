"use client";
import { useState } from "react";
import {Turnstile} from "@marsidev/react-turnstile";

export default function RequestDemoModal() {
  const [captchaToken, setCaptchaToken] = useState("");

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const form = e.currentTarget;
    const name = (form.elements.namedItem("name") as HTMLInputElement).value;
    const email = (form.elements.namedItem("email") as HTMLInputElement).value;

    const res = await fetch("/api/request-demo", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name,
        email,
        captchaToken, 
      }),
    });

    const data = await res.json();
    if (!res.ok) alert(data.error || "Failed");
  }

  return (
    <form onSubmit={submit} className="space-y-4">
      <input name="name" placeholder="Name" required />
      <input name="email" placeholder="Email" required />

      {/* ✅ CAPTCHA */}
      <Turnstile
        siteKey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY!}
        onSuccess={(token) => setCaptchaToken(token)}
        onExpire={() => setCaptchaToken("")}
      />

      <button type="submit" disabled={!captchaToken}>
        Submit
      </button>
    </form>
  );
}
