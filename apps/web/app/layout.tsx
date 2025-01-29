import type { Metadata } from 'next';
import '@/styles/globals.css';
import { noto_sans } from '@/styles/fonts';
import React from 'react';
import { Providers } from '@/app/providers';
import PageHeader from '@/components/page-header';
import { NextIntlClientProvider } from 'next-intl';
import { getLocale, getMessages } from 'next-intl/server';

export const metadata: Metadata = {
  title: 'Home | atmintis',
  description: 'All your memories in one place',
  icons: {
    icon: '/icon.svg',
  },
  openGraph: {
    title: 'atmintis',
    description: 'All your memories in one place',
    url: 'https://atmintis.vercel.app',
    siteName: 'atmintis',
    type: 'website',
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const locale = await getLocale();
  const messages = await getMessages();

  return (
    <html lang={locale} suppressHydrationWarning>
      <body className={`${noto_sans.className} antialiased`}>
        <Providers>
          <NextIntlClientProvider messages={messages}>
            <PageHeader />
            <main className="container">{children}</main>
          </NextIntlClientProvider>
        </Providers>
      </body>
    </html>
  );
}
