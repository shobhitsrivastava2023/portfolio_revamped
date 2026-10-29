"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLogin() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setError(null);
    const res = await fetch("/api/drawer/login", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ password }),
    });
    setBusy(false);
    if (res.ok) router.refresh();
    else setError("wrong password");
  };

  return (
    <form onSubmit={submit} className="mt-8 flex flex-col gap-3">
      <label className="font-outfit font-medium text-[#323232]" style={{ fontSize: 15 }}>
        password
        <input
          type="password"
          autoFocus
          autoComplete="current-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="mt-1 block w-full rounded-[10px] border-2 border-[#323232] bg-transparent px-3 py-2.5 text-[#1B1B1B] outline-none focus:border-[#FC6E20]"
          style={{ fontSize: 16 }}
        />
      </label>
      {error && <p className="text-[#C2410C]" style={{ fontSize: 14 }}>{error}</p>}
      <button
        type="submit"
        disabled={busy || !password}
        className="min-h-[44px] rounded-[10px] border-0 bg-[#FC6E20] font-outfit font-semibold text-[#323232] cursor-pointer disabled:opacity-50"
        style={{ fontSize: 18, letterSpacing: "-0.04em" }}
      >
        {busy ? "checking..." : "open the drawer"}
      </button>
    </form>
  );
}
