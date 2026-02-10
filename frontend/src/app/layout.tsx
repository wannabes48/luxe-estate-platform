import type { Metadata } from "next";
import { Inter, Playfair } from 'next/font/google'
import "./globals.css";
import ClientCursor from '@/components/Cursor'

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
      </body>
    </html>
  );
}
