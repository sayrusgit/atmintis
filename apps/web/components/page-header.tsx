import Link from 'next/link';
import React from 'react';
import { getSession } from '@/lib/session';
import PageHeaderInput from '@/components/page-header-input';
import NavUser from '@/components/user-nav';
import NewEntry from '@/components/new-entry';
import { Button } from '@/components/ui/button';
import { get } from '@/lib/neofetch';
import { IList } from '@shared/types';
import Image from 'next/image';
import PageHeaderDialogContent from '@/components/page-header-dialog-content';

export default async function PageHeader() {
  const user = await getSession();
  const data = await get<IList[]>('lists');

  return (
    <header className="mb-lg flex items-center border-b">
      <div className="container relative flex h-[70px] items-center justify-between gap-sm py-4">
        <Link href="/" className="hidden md:block">
          <Image src="/atmintis_logo.svg" alt="atmintis logotype" width={120} height={32} />
        </Link>
        {user && <PageHeaderInput userId={user._id} />}
        {user ? (
          <div className="flex gap-sm justify-self-end">
            <NewEntry lists={data} user={user} />
            <NavUser user={user} />
          </div>
        ) : (
          <div className="flex gap-sm">
            <Link href="/signin">
              <Button variant="outline">Sign in</Button>
            </Link>
            <Link href="/signup">
              <Button>Sign up</Button>
            </Link>
          </div>
        )}
      </div>
    </header>
  );
}
