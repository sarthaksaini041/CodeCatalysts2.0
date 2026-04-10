import React from 'react';
import Head from 'next/head';
import dynamic from 'next/dynamic';

const ApplyPageContent = dynamic(() => import('../src/pages/ApplyPage'), { ssr: false });

export default function Apply() {
  return (
    <>
      <Head>
        <title>Code Catalysts</title>
        <meta name="description" content="Apply to join Code Catalysts — a community of passionate builders and developers." />
        <meta property="og:title" content="Code Catalysts" />
      </Head>
      <ApplyPageContent />
    </>
  );
}
