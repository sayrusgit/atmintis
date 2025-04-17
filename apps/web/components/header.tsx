import Link from 'next/link';
import React from 'react';
import HeaderInput from '@/components/header-input';
import HeaderNew from '@/components/header-new';
import { Button } from '@/components/ui/button';
import type { IList, IUser } from '@shared/types';
import HeaderMenu from '@/components/header-menu';
import { $fetch } from '@/lib/fetch';
import HeaderLogo from '@/components/header-logo';
import { ArrowRight } from 'lucide-react';
import { getLocalSession } from '@/lib/session';

export default async function Header({ user }: { user: IUser | null }) {
  const session = await getLocalSession();

  const { data: lists } = await $fetch<IList[]>('/lists/get-by-user/:id', {
    params: { id: user?._id },
  });

  return (
    <header>
      {!user?.isEmailVerified && session && (
        <Link href="/settings">
          <div className="bg-secondary hover:bg-hover flex h-6 items-center justify-center gap-1.5 p-1 text-center text-xs transition-colors">
            Verify your email address <ArrowRight className="icon-sm" />
          </div>
        </Link>
      )}
      <div className="mb-lg flex items-center border-b">
        <div className="gap-sm relative container flex h-[70px] items-center justify-between py-4">
          <div className="min-w-[36px] md:min-w-[120px]">
            <HeaderLogo />
          </div>
          {user && <HeaderInput userId={user._id} />}
          {user ? (
            <div className="gap-sm flex">
              <HeaderNew lists={lists} user={user} />
              <HeaderMenu user={user} />
            </div>
          ) : (
            <div className="gap-sm flex">
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
