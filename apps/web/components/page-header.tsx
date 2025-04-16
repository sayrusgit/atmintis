import Link from 'next/link';
import React from 'react';
import PageHeaderInput from '@/components/page-header-input';
import NewEntry from '@/components/new-entry';
import { Button } from '@/components/ui/button';
import type { IList, IUser } from '@shared/types';
import PageHeaderNav from '@/components/page-header-nav';
import { $fetch } from '@/lib/fetch';
import PageHeaderLogo from '@/components/page-header-logo';
import { ArrowRight } from 'lucide-react';
import { getLocalSession } from '@/lib/session';

export default async function PageHeader({ user }: { user: IUser | null }) {
  const session = await getLocalSession();

  const { data: lists } = await $fetch<IList[]>('/lists/get-by-user/:id', {
    params: { id: user?._id },
  });

  return (
    <header>
      {!user?.isEmailVerified && session && (
        <Link href="/settings">
          <div className="flex h-6 items-center justify-center gap-1.5 bg-secondary p-1 text-center text-xs transition-colors hover:bg-hover">
            Verify your email address <ArrowRight className="icon-sm" />
          </div>
        </Link>
      )}
      <div className="mb-lg flex items-center border-b">
        <div className="container relative flex h-[70px] items-center justify-between gap-sm py-4">
          <div className="min-w-[36px] md:min-w-[120px]">
            <PageHeaderLogo />
          </div>
          {user && <PageHeaderInput userId={user._id} />}
          {user ? (
            <div className="flex gap-sm">
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
