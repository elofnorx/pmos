import { Inter } from 'next/font/google';
import './globals.css';

// Configure the Inter font with latin and latin-ext subsets for Turkish character support
const inter = Inter({ subsets: ['latin', 'latin-ext'] });

export const metadata = {
  title: 'PMOS | Kadın Sağlığı ve Yaşam Tarzı Platformu',
  description: 'Kadın sağlığı, yaşam tarzı, hamilelik ve annelik üzerine güncel, güvenilir ve ilham verici içerikler sunan platform.',
};

import NextAuthProvider from '@/components/providers/NextAuthProvider';

export default function RootLayout({ children }) {
  return (
    <html lang="tr">
      <body className={inter.className}>
        <NextAuthProvider>
          {children}
        </NextAuthProvider>
      </body>
    </html>
  );
}
