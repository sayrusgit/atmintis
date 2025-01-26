'use client';

import React from 'react';
import { useTheme } from 'next-themes';
import Image from 'next/image';

function PageHeaderLogo({ light, dark }: { light: React.ReactNode; dark: React.ReactNode }) {
  const { theme } = useTheme();

  return <div>{theme === 'dark' ? dark : light}</div>;
}

export default PageHeaderLogo;
