"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const res = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    setLoading(false);

    if (!res.ok) {
      setError("Invalid email or password");
      return;
    }

    router.push("/admin-nbm-x492d");
  }

  return (
    <div className="min-h-screen flex items-center justify-center">
      {/* Glass card */}
      <form
        onSubmit={submit}
        className="
          w-full max-w-sm
          bg-white/20
          backdrop-blur-md
          border border-white/30
          rounded-xl
          shadow-xl
          p-8
          space-y-4
        "
      >
        <h1 className="text-xl font-semibold text-white text-center">
          Admin Login
        </h1>

        <input
          type="email"
          placeholder="Email"
          className="
            w-full p-3 rounded
            bg-white/80
            outline-none
          "
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Password"
          className="
            w-full p-3 rounded
            bg-white/80
            outline-none
          "
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        {error && (
          <p className="text-red-200 text-sm text-center">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="
            w-full py-3 rounded
            bg-black text-white
            hover:bg-gray-900
            transition
            disabled:opacity-50
          "
        >
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>
    </div>
  );
}
