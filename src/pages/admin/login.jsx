import React, { useState } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { Mail, Lock, AlertCircle, ArrowLeft, Loader2 } from 'lucide-react';
import { signIn } from '@/core/services/admin';

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await signIn(email, password);
      router.push('/admin');
    } catch (err) {
      setError(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Head>
        <title>Sign In | Admin</title>
        <meta name="robots" content="noindex, nofollow" />
      </Head>

      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
        {/* Back to site */}
        <button
          onClick={() => router.push('/')}
          className="absolute top-6 left-6 flex items-center gap-2 text-sm text-slate-400 hover:text-slate-700 transition-colors font-medium"
        >
          <ArrowLeft size={16} /> Back to site
        </button>

        <div className="w-full max-w-sm">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-12 h-12 rounded-xl bg-indigo-600 flex items-center justify-center mx-auto mb-4">
              <Lock size={20} className="text-white" />
            </div>
            <h1 className="text-xl font-semibold text-slate-900">Admin Sign In</h1>
            <p className="text-sm text-slate-400 mt-1">Code Catalysts</p>
          </div>

          {/* Form */}
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-1.5">
              <label className="block text-xs font-medium text-slate-600">Email</label>
              <div className="relative">
                <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@example.com"
                  className="w-full bg-white border border-slate-200 rounded-lg py-2.5 pl-10 pr-3 text-sm text-slate-900 placeholder:text-slate-400 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-colors"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-medium text-slate-600">Password</label>
              <div className="relative">
                <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-white border border-slate-200 rounded-lg py-2.5 pl-10 pr-3 text-sm text-slate-900 placeholder:text-slate-400 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-colors"
                />
              </div>
            </div>

            {error && (
              <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600">
                <AlertCircle size={16} className="flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-indigo-600 text-white font-semibold text-sm py-2.5 rounded-lg hover:bg-indigo-700 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500/40 focus:ring-offset-1 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? <Loader2 size={16} className="animate-spin" /> : null}
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>
        </div>
      </div>
    </>
  );
}
