"use client";
import { useState } from "react";
import { Turnstile } from "@marsidev/react-turnstile";

export default function RequestDemoForm() {
  const [showCaptcha, setShowCaptcha] = useState(false);
  const [formData, setFormData] = useState<{ name: string; email: string } | null>(null);

  function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const form = e.currentTarget;
    const name = (form.elements.namedItem("name") as HTMLInputElement).value;
    const email = (form.elements.namedItem("email") as HTMLInputElement).value;

    setFormData({ name, email });
    setShowCaptcha(true); // 🔑 render Turnstile AFTER click
  }

  async function onCaptchaSuccess(token: string) {
    if (!formData) return;

    const res = await fetch("/api/request-demo", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...formData,
        captchaToken: token,
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      alert(data.error || "Request failed");
    } else {
      alert("Demo request submitted successfully");
      setShowCaptcha(false);
      setFormData(null);
    }
  }

  return (
    <form onSubmit={submit} className="space-y-4">
      <input name="name" placeholder="Name" required />
      <input name="email" placeholder="Email" required />

      {showCaptcha && (
        <Turnstile
          siteKey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY!}
          onSuccess={onCaptchaSuccess}
        />
      )}

      <button type="submit">Submit</button>
    </form>
  );
}
