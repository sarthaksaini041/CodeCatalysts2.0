import React, { useEffect, useState } from 'react';
import Head from 'next/head';
import dynamic from 'next/dynamic';
import { useCMS } from '../hooks/useCMS';
import { motion } from 'framer-motion';
import Button from '../components/Button';
import { useRouter } from 'next/router';
import { AlertCircle } from 'lucide-react';

const ApplyPageContent = dynamic(() => import('../components/content/ApplyPageContent'), { ssr: false });

export default function Apply() {
  const { siteContent, loading } = useCMS();
  const router = useRouter();
  const [show404, setShow404] = useState(false);

  useEffect(() => {
    if (!loading && siteContent.applyPageEnabled === 'false') {
      setShow404(true);
    }
  }, [siteContent.applyPageEnabled, loading]);

  if (show404) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-black text-white p-6 text-center font-outfit">
        <Head>
          <title>404 - Page Not Found | Code Catalysts</title>
        </Head>
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-2xl w-full px-4"
        >
          <div className="mb-8 flex justify-center">
            <div className="p-4 bg-rose-500/10 rounded-full border border-rose-500/20 text-rose-500">
              <AlertCircle size={48} />
            </div>
          </div>
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black mb-4 tracking-tighter uppercase italic bg-gradient-to-r from-indigo-400 to-cyan-400 bg-clip-text text-transparent leading-none">
            We’re Full (For Now!)
          </h1>
          <h2 className="text-xl font-bold mb-6 text-slate-200">Hey! Thanks for your interest 😊</h2>
          <p className="text-slate-400 mb-10 leading-relaxed">
            Our team is currently full, so we’re not taking new members right now.<br />
            But don’t worry, this might change soon!
          </p>
          <Button onClick={() => router.push('/')} variant="default" size="lg" className="w-full">
            RETURN TO HOME
          </Button>
        </motion.div>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>Code Catalysts | Apply</title>
        <meta name="description" content="Apply to join Code Catalysts — a community of passionate builders and developers." />
        <meta property="og:title" content="Code Catalysts" />
      </Head>
      {!loading && siteContent.applyPageEnabled !== 'false' && <ApplyPageContent />}
      {loading && (
        <div className="flex items-center justify-center min-h-screen bg-black">
           <div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
        </div>
      )}
    </>
  );
}
