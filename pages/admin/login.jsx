import React from 'react';
import Head from 'next/head';
import dynamic from 'next/dynamic';

const AdminLoginContent = dynamic(() => import('../../src/pages/AdminLogin'), { ssr: false });

export default function AdminLoginPage() {
  return (
    <>
      <Head>
        <title>Code Catalysts Admin</title>
        <meta name="robots" content="noindex, nofollow" />
      </Head>
      <AdminLoginContent />
    </>
  );
}
