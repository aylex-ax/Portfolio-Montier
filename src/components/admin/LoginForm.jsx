"use client";
import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth, isMockMode } from "@/lib/firebase";

export default function LoginForm({ onLoginSuccess }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      if (email === "admin@montier.dev" && password === "adminaylex") {
        onLoginSuccess({ email, uid: "dev-admin-id" });
        setLoading(false);
        return;
      }

      if (isMockMode) {
        setError("Invalid dev credentials. Firebase is not configured.");
        setLoading(false);
        return;
      }

      await signInWithEmailAndPassword(auth, email, password);
      onLoginSuccess();
    } catch (err) {
      setError("Invalid credentials or unauthorized access.");
    }
    setLoading(false);
  };

  return (
    <div className="w-full max-w-md bg-black-light p-8 rounded-lg border border-white/10 shadow-2xl">
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold tracking-widest text-gold-500 uppercase font-sans mb-2">Montier Admin</h1>
        <p className="text-gray-500 text-sm">Secure Editor Console</p>
      </div>

      <form onSubmit={handleLogin} className="flex flex-col gap-6">
        {error && <div className="p-3 bg-red-900/50 text-red-200 text-sm rounded border border-red-500/30">{error}</div>}

        <div className="flex flex-col gap-2">
          <label className="text-sm text-gray-400 font-sans tracking-wider">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="bg-black-pure border border-white/10 rounded p-3 text-white focus:outline-none focus:border-gold-500 transition-colors"
            required
            dir="ltr"
          />
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-sm text-gray-400 font-sans tracking-wider">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="bg-black-pure border border-white/10 rounded p-3 text-white focus:outline-none focus:border-gold-500 transition-colors"
            required
            dir="ltr"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="mt-4 bg-gold-500 hover:bg-gold-400 text-black-pure font-bold py-3 px-4 rounded transition-colors uppercase tracking-widest disabled:opacity-50"
        >
          {loading ? "Authenticating..." : "Login"}
        </button>
      </form>
    </div>
  );
}
