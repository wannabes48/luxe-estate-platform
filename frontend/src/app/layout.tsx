import type { Metadata } from "next";
import { Inter, Playfair } from 'next/font/google'
import "./globals.css";
import ClientCursor from '@/components/Cursor'
import { GoogleAnalytics } from '@next/third-parties/google';
import Script from 'next/script';

const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin'],
  display: 'swap',
})

const playfair = Playfair({
  variable: '--font-playfair',
  subsets: ['latin'],
  display: 'swap',
})

export const metadata: Metadata = {
  title: {
    template: '%s | Luxe Estate',
    default: 'Luxe Estate | Fractional Luxury Real Estate in Kenya',
  },
  description: 'The premier Web3-integrated fractional real estate marketplace. Invest in curated architectural homes in Kenya, powered by Polygon smart contracts and M-Pesa yields.',
  keywords: [
    'fractional real estate Kenya',
    'tokenized property Africa',
    'luxury homes Kisii',
    'Milimani real estate',
    'Web3 real estate investing',
    'Polygon property tokens',
    'M-Pesa real estate yields',
    'PropTech Kenya',
    'buy property shares online',
    'modernist architecture Kenya'
  ],
  authors: [{ name: 'Luxe Estate' }],
  creator: 'Siro Production',
  metadataBase: new URL('https://your-vercel-domain.vercel.app'), // Update this!
  openGraph: {
    type: 'website',
    locale: 'en_KE',
    url: 'https://your-vercel-domain.vercel.app',
    title: 'Luxe Estate Platform | Liquid Equity. Uncompromising Design.',
    description: 'Bridge the gap between physical architecture and digital liquidity. Trade fractional property shares peer-to-peer.',
    siteName: 'Luxe Estate Platform',
    images: [
      {
        url: '/og-image.jpg', // Add a stunning 1200x630px architectural image to your public folder
        width: 1200,
        height: 630,
        alt: 'Luxe Estate Fractional Real Estate',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Luxe Estate | Tokenized Luxury Real Estate',
    description: 'Invest in curated Kenyan real estate using M-Pesa. Powered by Polygon.',
    images: ['/og-image.jpg'],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${playfair.variable} antialiased`}>
        <ClientCursor />
        {children}
        <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || ''} />
        <Script id="chatbot-config" strategy="beforeInteractive">
          {`
            window.CHATBOT_BASE_URL = 'https://luxe-ai-chatbot-widget.wannabes48.workers.dev';
            window.CHATBOT_TITLE = 'Luxe Assistant';
            window.CHATBOT_GREETING = 'Welcome to Luxe Estate. How can I help you find your dream home today?';
          `}
        </Script>
        <Script src="https://luxe-ai-chatbot-widget.wannabes48.workers.dev/widget.js" strategy="lazyOnload" />
      </body>
    </html>
  );
}
