import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { motion } from 'framer-motion';
import { Loader2, Mail, Lock, AlertCircle, ChevronLeft } from 'lucide-react';
import { supabase } from '../lib/supabase-browser';

const AdminLogin = () => {
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
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;
      router.push('/admin');
    } catch (err) {
      setError(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#050505] flex items-center justify-center p-6 relative overflow-hidden">
      {/* Noise Overlay */}
      <div className="fixed inset-0 pointer-events-none opacity-[0.03]" 
           style={{ backgroundImage: "url('https://grainy-gradients.vercel.app/noise.svg')" }} />
      
      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/10 rounded-full blur-[120px] pointer-events-none" />

      <motion.button 
        onClick={() => router.push('/')}
        className="absolute top-8 left-8 flex items-center gap-2 text-white/40 hover:text-white transition-colors font-black text-xs tracking-widest uppercase z-10"
      >
        <ChevronLeft size={16} /> EXIT_TO_BASE
      </motion.button>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-white/[0.02] backdrop-blur-2xl border border-white/5 p-12 rounded-[40px] relative z-10 shadow-2xl"
      >
        <div className="text-center mb-10">
          <h1 className="text-4xl font-black mb-2 tracking-tighter bg-gradient-to-b from-white to-white/50 bg-clip-text text-transparent">
            ADMIN_ACCESS
          </h1>
          <p className="text-white/40 text-sm font-black tracking-widest uppercase">
            Code Catalysts Control Hub
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-white/30 ml-4">
              Admin Email
            </label>
            <div className="relative group">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-primary transition-colors" size={18} />
              <input 
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email address"
                className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white text-sm outline-none focus:border-primary/50 transition-all"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-white/30 ml-4">
              Access Key
            </label>
            <div className="relative group">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-primary transition-colors" size={18} />
              <input 
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white text-sm outline-none focus:border-primary/50 transition-all"
              />
            </div>
          </div>

          {error && (
            <motion.div 
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-red-500/10 border border-red-500/20 p-4 rounded-xl flex items-center gap-3 text-red-400 text-xs font-black"
            >
              <AlertCircle size={16} /> {error}
            </motion.div>
          )}

          <motion.button
            whileHover={{ scale: 1.02, y: -2 }}
            whileTap={{ scale: 0.98 }}
            disabled={loading}
            className="w-full bg-white text-black font-black py-4 rounded-2xl flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed transition-all mt-8"
          >
            {loading ? <Loader2 className="animate-spin" size={20} /> : 'AUTHENTICATE'}
          </motion.button>
        </form>
      </motion.div>
    </div>
  );
};

export default AdminLogin;
