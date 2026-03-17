import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Agent & Developer Portal',
  description: 'List your luxury properties on Luxe Estate. Reach global Web3 investors and tokenize your architectural inventory for faster liquidity.',
  keywords: [
    'list luxury property Kenya',
    'real estate agent portal',
    'tokenize real estate development',
    'sell luxury homes Nairobi, Kisii, Mombasa, Nakuru, Kenya, Kisumu, Malindi, Kwale, Joska',
    'property fractionalization services'
  ],
};

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}