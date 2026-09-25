"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function SignInPage() {
  const router = useRouter();
  const [mode, setMode] = useState<"in" | "up">("in");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    setError("");
    const response = await fetch(mode === "in" ? "/api/auth/sign-in" : "/api/auth/sign-up", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    const data = (await response.json()) as { error?: string };
    if (!response.ok) {
      setError(data.error ?? "Could not sign in.");
      return;
    }
    router.push("/scans");
    router.refresh();
  }

  return (
    <div className="mx-auto max-w-md px-4 py-16 md:px-6">
      <p className="text-[11px] font-medium uppercase tracking-[0.16em] text-faint">
        {mode === "in" ? "Sign in" : "Create account"}
      </p>
      <h1 className="mt-3 text-3xl font-semibold tracking-tight">
        {mode === "in" ? "Welcome back" : "Save your scans"}
      </h1>
      <form onSubmit={submit} className="mt-8 space-y-4">
        <input
          type="email"
          required
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          placeholder="Email"
          className="w-full rounded-xl border border-line bg-card px-4 py-3 text-sm outline-none"
        />
        <input
          type="password"
          required
          minLength={8}
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          placeholder="Password"
          className="w-full rounded-xl border border-line bg-card px-4 py-3 text-sm outline-none"
        />
        {error ? <p className="text-sm text-red-300">{error}</p> : null}
        <button type="submit" className="rounded-full bg-faint px-5 py-2.5 text-sm font-semibold text-ink">
          {mode === "in" ? "Sign in" : "Create account"}
        </button>
      </form>
      <button
        type="button"
        className="mt-6 text-sm text-muted"
        onClick={() => setMode(mode === "in" ? "up" : "in")}
      >
        {mode === "in" ? "Need an account? Create one" : "Already have an account? Sign in"}
      </button>
    </div>
  );
}
