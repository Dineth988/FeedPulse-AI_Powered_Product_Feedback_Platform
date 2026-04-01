'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

const ADMIN_EMAIL    = 'admin@feedpulse.com';
const ADMIN_PASSWORD = 'admin123';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [error, setError]       = useState('');
  const [loading, setLoading]   = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    await new Promise((r) => setTimeout(r, 600)); // simulate network

    if (email.trim() === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
      localStorage.setItem('fp_admin', 'true');
      router.push('/dashboard');
    } else {
      setError('Invalid email or password.');
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-zinc-950 flex items-center justify-center px-4">

      {/* Background grid */}
      <div
        className="fixed inset-0 pointer-events-none opacity-[0.03]"
        style={{
          backgroundImage: `linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)`,
          backgroundSize: '40px 40px',
        }}
      />

      <div className="relative z-10 w-full max-w-sm">

        {/* Brand */}
        <div className="flex items-center justify-center gap-2.5 mb-10">
          <div className="w-8 h-8 rounded-lg bg-amber-500 flex items-center justify-center">
            <svg className="w-4 h-4 text-zinc-900" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 01.865-.501 48.172 48.172 0 003.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z" />
            </svg>
          </div>
          <span className="text-lg font-semibold text-white tracking-tight">FeedPulse</span>
        </div>

        {/* Card */}
        <div className="rounded-2xl bg-zinc-900/80 border border-zinc-800/60 backdrop-blur-sm shadow-2xl shadow-black/40 px-8 py-8">
          <div className="mb-6">
            <h1 className="text-xl font-semibold text-white">Admin sign in</h1>
            <p className="text-sm text-zinc-500 mt-1">Access the FeedPulse dashboard</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">

            {/* Error */}
            {error && (
              <div className="flex items-center gap-2 rounded-lg bg-red-500/10 border border-red-500/20 px-3 py-2.5">
                <svg className="w-4 h-4 text-red-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
                </svg>
                <p className="text-xs text-red-400">{error}</p>
              </div>
            )}

            {/* Email */}
            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-zinc-300">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@feedpulse.com"
                required
                className="w-full rounded-lg bg-zinc-800/60 border border-zinc-700/60 px-4 py-3 text-sm text-white placeholder:text-zinc-600 outline-none transition-all hover:border-zinc-600 focus:ring-2 focus:ring-amber-500/40 focus:border-amber-500/50"
              />
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-zinc-300">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="w-full rounded-lg bg-zinc-800/60 border border-zinc-700/60 px-4 py-3 text-sm text-white placeholder:text-zinc-600 outline-none transition-all hover:border-zinc-600 focus:ring-2 focus:ring-amber-500/40 focus:border-amber-500/50"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 rounded-lg bg-amber-500 hover:bg-amber-400 disabled:bg-amber-500/40 disabled:cursor-not-allowed text-zinc-900 font-semibold text-sm px-6 py-3 transition-all"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                  </svg>
                  Signing in…
                </span>
              ) : 'Sign in'}
            </button>
          </form>
        </div>

        <p className="text-center text-xs text-zinc-700 mt-4">
          Admin access only · FeedPulse
        </p>
      </div>
    </main>
  );
}