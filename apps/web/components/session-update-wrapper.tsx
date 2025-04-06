'use client';

import React, { useEffect } from 'react';
import { getLocalSession, updateSession } from '@/lib/session';

export default function SessionUpdateWrapper({ children }: { children: React.ReactNode }) {
  const refreshSession = async () => {
    const session = await getLocalSession();
    const now = Date.now();

    if (session && session.exp <= now) await updateSession();

    if (session) {
      const expTimestamp = session.exp * 1000;

      setTimeout(() => {
        updateSession();
      }, expTimestamp - now);
    }
  };

  useEffect(() => {
    refreshSession();
  }, []);

  return children;
}
