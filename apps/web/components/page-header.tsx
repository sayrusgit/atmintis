import Link from 'next/link';
import React from 'react';
import { getSession } from '@/lib/session';
import PageHeaderInput from '@/components/page-header-input';
import NewEntry from '@/components/new-entry';
import { Button } from '@/components/ui/button';
import { IList } from '@shared/types';
import PageHeaderNav from '@/components/page-header-nav';
import { $fetch } from '@/lib/fetch';
import PageHeaderLogo from '@/components/page-header-logo';

export default async function PageHeader() {
  const user = await getSession();

  const { data: lists } = await $fetch<IList[]>('/lists/get-by-user/:id', {
    params: { id: user?._id },
  });

  return (
    <header className="mb-lg flex items-center border-b">
      <div className="container relative flex h-[70px] items-center justify-between gap-sm py-4">
        <div className="w-[120px]">
          <Link href="/" className="hidden md:block">
            <PageHeaderLogo />
          </Link>
        </div>
        {user && <PageHeaderInput userId={user._id} />}
        {user ? (
          <div className="flex gap-sm justify-self-end">
            <NewEntry lists={lists} user={user} />
            <PageHeaderNav user={user} />
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
