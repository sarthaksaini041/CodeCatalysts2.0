import { Html, Head, Main, NextScript } from 'next/document';

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        {/* ── DNS prefetch for external domains ─────────────────────── */}
        <link rel="dns-prefetch" href="https://fonts.googleapis.com" />
        <link rel="dns-prefetch" href="https://ebyimwixrytwgvdvgmmz.supabase.co" />

        {/* ── Preconnect for critical external resources ─────────────── */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />

        {/* ── Google Fonts: only load weights actually used ──────────── 
            Outfit: 400 (body), 700 (bold), 900 (headings), 950 (display — mapped to 900)
            Inter: 400 (body), 500 (medium), 700 (bold)
            JetBrains Mono: 400, 700 (code labels only)
            display=swap ensures text is shown in fallback font until loaded
        */}
        <link
          href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;700;900&family=Inter:wght@400;500;700&family=JetBrains+Mono:wght@400;700&display=swap"
          rel="stylesheet"
        />

        {/* ── Preload the LCP asset (logo SVG) ──────────────────────── */}
        <link rel="preload" as="image" href="/logo.svg" type="image/svg+xml" fetchPriority="high" />

        {/* ── Favicons ──────────────────────────────────────────────── */}
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
        <link rel="icon" type="image/x-icon" href="/favicon.ico" />

        {/* ── SEO & theme ───────────────────────────────────────────── */}
        <meta name="theme-color" content="#000000" />
        <meta name="author" content="Code Catalysts" />
        <meta name="robots" content="index, follow" />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
