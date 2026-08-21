import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'VoltVision | EV Commercial Insurance Pricing Engine',
  description: 'Professional Poisson-Gamma GLM actuarial pricing engine for Malaysian electric vehicles. Calculate commercial premiums with real-time actuarial transparency.',
  keywords: 'EV insurance Malaysia, electric vehicle premium, actuarial GLM, commercial motor insurance',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
      </head>
      <body className="min-h-screen bg-slate-50 antialiased">{children}</body>
    </html>
  );
}
