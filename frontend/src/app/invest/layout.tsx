import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Invest & Trade Marketplace',
  description: 'Browse primary offerings or trade fractional property shares on our peer-to-peer secondary market. Earn automated monthly rental yields.',
  keywords: [
    'buy fractional property',
    'real estate secondary market',
    'peer to peer property trading',
    'high yield real estate Kenya',
    'tokenized asset marketplace'
  ],
  openGraph: {
    title: 'Luxe Marketplace | Trade Fractional Real Estate',
    description: 'Access premium architectural assets. Buy original shares or trade on the secondary market.',
  }
};

export default function InvestLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}