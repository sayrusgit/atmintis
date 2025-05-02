'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function EntryKeyboardNav() {
  const router = useRouter();

  useEffect(() => {
    const handleBack = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.code === 'BracketLeft') router.back();
    };

    window.addEventListener('keydown', handleBack);

    return () => {
      window.removeEventListener('keydown', handleBack);
    };
  }, []);

  return <div className="hidden"></div>;
}
