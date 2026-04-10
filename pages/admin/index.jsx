import React, { useEffect, useState } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import dynamic from 'next/dynamic';
import { Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { supabase } from '../../src/lib/supabase-browser';

const AdminDashboardContent = dynamic(() => import('../../src/pages/AdminDashboard'), { ssr: false });

export default function AdminPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) {
          router.replace('/admin/login');
          return;
        }
        setAuthenticated(true);
      } catch (error) {
        console.error('Auth check error:', error);
        router.replace('/admin/login');
      } finally {
        setLoading(false);
      }
    };

    checkAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session) {
        router.replace('/admin/login');
      }
      setAuthenticated(!!session);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, [router]);

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', width: '100%', background: '#050505', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}
        >
          <Loader2 style={{ animation: 'spin 1s linear infinite', color: 'var(--primary)' }} size={32} />
          <p style={{ color: 'rgba(255,255,255,0.2)', fontSize: '10px', fontWeight: 900, letterSpacing: '0.2em', textTransform: 'uppercase' }}>
            Loading...
          </p>
        </motion.div>
      </div>
    );
  }

  if (!authenticated) return null;

  return (
    <>
      <Head>
        <title>Code Catalysts Admin</title>
        <meta name="robots" content="noindex, nofollow" />
      </Head>
      <AdminDashboardContent />
    </>
  );
}
