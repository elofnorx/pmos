import { Inter } from 'next/font/google';
import './globals.css';

// Configure the Inter font with latin and latin-ext subsets for Turkish character support
const inter = Inter({ subsets: ['latin', 'latin-ext'] });

export const metadata = {
  title: 'PMOS | Kadın Sağlığı ve Yaşam Tarzı Platformu',
  description: 'Kadın sağlığı, yaşam tarzı, hamilelik ve annelik üzerine güncel, güvenilir ve ilham verici içerikler sunan platform.',
  other: {
    'google-adsense-account': 'ca-pub-2359217193066885'
  }
};

import NextAuthProvider from '@/components/providers/NextAuthProvider';
import Script from 'next/script';

export default function RootLayout({ children }) {
  return (
    <html lang="tr">
      <head>
        {/* Cookiebot (GDPR/Çerez Onay) */}
        <Script
          id="Cookiebot"
          src="https://consent.cookiebot.com/uc.js"
          data-cbid="9c6adf5a-de7d-4880-98e5-603afa3beadd"
          strategy="beforeInteractive"
        />
        
        {/* Google Tag (gtag.js) */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=AW-18478350290"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());

            gtag('config', 'AW-18478350290');
          `}
        </Script>
        
        {/* Google AdSense */}
        <Script
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-2359217193066885"
          crossOrigin="anonymous"
          strategy="afterInteractive"
        />
      </head>
      <body className={inter.className}>
        <NextAuthProvider>
          {children}
        </NextAuthProvider>
      </body>
    </html>
  );
}
