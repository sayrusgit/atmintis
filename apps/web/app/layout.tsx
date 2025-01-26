import type { Metadata } from 'next';
import '@/styles/globals.css';
import { noto_sans } from '@/styles/fonts';
import React from 'react';
import { Providers } from '@/app/providers';
import PageHeader from '@/components/page-header';

export const metadata: Metadata = {
  title: 'Home | atmintis',
  description: 'All your memories in one place',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${noto_sans.className} antialiased`}>
        <Providers>
          <PageHeader />
          <main className="container">{children}</main>
        </Providers>
      </body>
    </html>
  );
}
