import { TailwindIndicator } from '@/components/tailwind-indicator';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { cn } from '@/lib/utils';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Drug DB',
  description: 'Drug DB website',
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={cn(inter.className)}>
        {children}
        <TailwindIndicator />
      </body>
    </html>
  );
}
