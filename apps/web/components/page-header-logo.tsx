'use client';

import React from 'react';
import { useTheme } from 'next-themes';
import Image from 'next/image';
import Link from 'next/link';

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
    <>
      <div className="hidden min-w-[120px] md:block">
        <Link href="/" className="hidden md:block">
          <Image
            src={theme === 'dark' ? '/atmintis_logo.svg' : '/atmintis_logo_dark.svg'}
            alt="atmintis logotype"
            width={120}
            height={32}
          />
        </Link>
      </div>
      <div className="block min-w-[36px] md:hidden">
        <Link href="/" className="block md:hidden">
          <Image
            src={'/icon.svg'}
            alt="atmintis logotype"
            width={36}
            height={36}
            className="rounded-md border"
          />
        </Link>
      </div>
    </>
  );
}

export default PageHeaderLogo;
