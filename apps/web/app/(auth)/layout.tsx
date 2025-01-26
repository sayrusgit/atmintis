import type { Metadata } from 'next';
import '@/styles/globals.css';
import React from 'react';

export const metadata: Metadata = {
  title: 'atmintis',
  description: 'All your memories in one place',
};

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="container-size-xs">
      {children}
      <p className="mt-lg text-balance text-center text-xs text-muted-foreground">
        By continuing, you agree to Atmintis' <span className="underline">Terms of Service</span>{' '}
        and <span className="underline">Privacy Policy</span>.
      </p>
    </div>
  );
};

export default Layout;
