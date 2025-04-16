import type { Metadata } from 'next';
import '@/styles/globals.css';
import { noto_sans } from '@/styles/fonts';
import React from 'react';
import { Providers } from '@/app/providers';
import PageHeader from '@/components/page-header';
import { NextIntlClientProvider } from 'next-intl';
import { getLocale, getMessages } from 'next-intl/server';
import { getSession } from '@/lib/session';
import { SpeedInsights } from '@vercel/speed-insights/next';

export const metadata: Metadata = {
  title: 'Dashboard | atmintis',
  description: 'All your knowledge in one place',
  icons: {
    icon: '/icon.svg',
  },
  openGraph: {
    title: 'atmintis',
    description: 'All your knowledge in one place',
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
  const [user, locale, messages] = await Promise.all([getSession(), getLocale(), getMessages()]);

  return (
    <html lang={locale} suppressHydrationWarning>
      {process.env.NODE_ENV === 'development' && (
        <head>
          <script src="https://unpkg.com/react-scan/dist/auto.global.js" />
        </head>
      )}
      <body className={`${noto_sans.className} antialiased`}>
        <Providers>
          <NextIntlClientProvider messages={messages}>
            <PageHeader user={user} />
            <main className="container">{children}</main>
          </NextIntlClientProvider>
        </Providers>
        <SpeedInsights />
      </body>
    </html>
  );
}
