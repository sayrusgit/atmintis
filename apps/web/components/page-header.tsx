import Link from 'next/link';
import React from 'react';
import PageHeaderInput from '@/components/page-header-input';
import NewEntry from '@/components/new-entry';
import { Button } from '@/components/ui/button';
import { IList, IUser } from '@shared/types';
import PageHeaderNav from '@/components/page-header-nav';
import { $fetch } from '@/lib/fetch';
import PageHeaderLogo from '@/components/page-header-logo';
import { ArrowRight } from 'lucide-react';

export default async function PageHeader({ user }: { user: IUser | null }) {
  const { data: lists } = await $fetch<IList[]>('/lists/get-by-user/:id', {
    params: { id: user?._id },
  });

  return (
    <header>
      <Link href="/settings">
        <div className="flex h-6 items-center justify-center gap-1.5 bg-secondary p-1 text-center text-xs transition-colors hover:bg-secondary/80">
          Verify your email address <ArrowRight className="icon-sm" />
        </div>
      </Link>
      <div className="mb-lg flex items-center border-b">
        <div className="container relative flex h-[70px] items-center justify-between gap-sm py-4">
          <div className="hidden w-[120px] md:block">
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
      </div>
    </header>
  );
}
