'use client';

import React, { useEffect } from 'react';

export default function EntryKeyboardNav() {
  useEffect(() => {
    const handlePressingCreate = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.key === 'Enter') handleCreate();
    };

    window.addEventListener('keydown', handleOpen);

    return () => {
      window.removeEventListener('keydown', handleOpen);
    };
  }, []);

  return <div className="hidden"></div>;
}
