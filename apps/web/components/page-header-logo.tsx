'use client';

import React from 'react';
import { useTheme } from 'next-themes';
import Image from 'next/image';

function PageHeaderLogo() {
  const { theme } = useTheme();

  const [isMounted, setIsMounted] = React.useState(false);

  React.useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  return (
    <Image
      src={theme === 'dark' ? '/atmintis_logo.svg' : '/atmintis_logo_dark.svg'}
      alt="atmintis logotype"
      width={120}
      height={32}
    />
  );
}

export default PageHeaderLogo;
