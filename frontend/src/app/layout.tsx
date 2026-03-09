import type { Metadata } from "next";
import { Inter, Playfair } from 'next/font/google'
import "./globals.css";
import ClientCursor from '@/components/Cursor'
import { GoogleAnalytics } from '@next/third-parties/google';

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
  title: "Luxe Estate Platform",
  description: "Luxury property listings",
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
        <script>
          window.CHATBOT_BASE_URL = 'https://luxe-ai-chatbot-widget.wannabes48.workers.dev/';
          window.CHATBOT_TITLE = 'Luxe Assistant';
          window.CHATBOT_GREETING = 'Welcome to Luxe Estate. How can I help you find your dream home today?';
        </script>
        <script src="https://luxe-ai-chatbot-widget.wannabes48.workers.dev//widget.js"></script>
      </body>
    </html>
  );
}
