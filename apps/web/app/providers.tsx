'use client';

import { ThemeProvider as NextThemesProvider } from 'next-themes';
import type { ComponentProps } from 'react';
import SessionUpdateWrapper from '@/components/session-update-wrapper';

export function Providers({ children }: ComponentProps<typeof NextThemesProvider>) {
  return (
    <NextThemesProvider attribute="class" defaultTheme="dark">
      <SessionUpdateWrapper>{children}</SessionUpdateWrapper>
    </NextThemesProvider>
  );
}
