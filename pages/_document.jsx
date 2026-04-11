import { Html, Head, Main, NextScript } from 'next/document';

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        {/* Resource Preloading */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        
        {/* Preload critical fonts to improve FCP */}
        <link
          rel="preload"
          as="style"
          href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;700;900&family=Inter:wght@400;700&display=swap"
        />
        
        {/* Preload LCP assets */}
        <link rel="preload" as="image" href="/logo.svg" type="image/svg+xml" fetchPriority="high" />
        
        <link
          href="https://fonts.googleapis.com/css2?family=Outfit:wght@100..900&family=Inter:wght@100..900&family=JetBrains+Mono:wght@400;700;900&display=swap"
          rel="stylesheet"
        />

        {/* Favicons */}
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
        <link rel="icon" type="image/x-icon" href="/favicon.ico" />

        {/* SEO defaults */}
        <meta name="theme-color" content="#050505" />
        <meta name="author" content="Code Catalysts" />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
