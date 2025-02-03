'use client';

import React, { useEffect, useState } from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
  DropdownMenuShortcut,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { MoonIcon, SunIcon } from '@radix-ui/react-icons';
import Image from 'next/image';
import { useTheme } from 'next-themes';
import { logout } from '@/lib/auth';
import { IUser } from '@shared/types';
import Link from 'next/link';
import { Dialog, DialogTrigger } from '@/components/ui/dialog';
import PageHeaderDialogContent from '@/components/page-header-dialog-content';
import { updateUserLocaleAction } from '@/lib/actions';
import { useTranslations } from 'use-intl';
import { STATIC_URL } from '@/lib/utils';

function PageHeaderNav({ user }: { user: IUser }) {
  const { theme, setTheme } = useTheme();

  const t = useTranslations('header.Nav');

  const toggleTheme = (themeToChange: string) => {
    if (theme === themeToChange) return;

    theme === 'dark' ? setTheme('light') : setTheme('dark');
  };

  const [isOpen, setIsOpen] = useState(false);

  const handleKeyboardShortcuts = (e: KeyboardEvent) => {
    if (e.code === 'KeyK' && e.ctrlKey) {
      e.stopPropagation();
      e.preventDefault();

      setIsOpen(true);
    }
  };

  useEffect(() => {
    window.addEventListener('keydown', handleKeyboardShortcuts);

    return () => {
      window.removeEventListener('keydown', handleKeyboardShortcuts);
    };
  }, []);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Avatar className="cursor-pointer rounded-md transition-all duration-300 ease-in-out hover:opacity-50">
            <AvatarImage
              src={`${STATIC_URL}/images/${user?.profilePicture}`}
              alt="profile pic"
              className="object-cover"
              style={{ overflowClipMargin: 'unset' }}
            />
            <AvatarFallback className="rounded-md">{user?.username}</AvatarFallback>
          </Avatar>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="mt-3 w-56 p-xs" align="end" forceMount>
          <DropdownMenuLabel className="font-normal">
            <div className="flex flex-col space-y-1">
              <p className="text-sm font-medium leading-none">{user.username}</p>
              <p className="text-xs leading-none text-muted-foreground">{user.email}</p>
              <p className="text-xs leading-none text-muted-foreground">id: {user._id}</p>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator className="my-2" />
          <DropdownMenuGroup>
            <DropdownMenuSub>
              <DropdownMenuSubTrigger className="text-md my-2">{t('theme')}</DropdownMenuSubTrigger>
              <DropdownMenuPortal>
                <DropdownMenuSubContent className="mx-3 w-36 p-xs">
                  <span onClick={() => toggleTheme('dark')}>
                    <DropdownMenuItem className="text-md mb-1">
                      <div className="flex items-center justify-between">
                        <MoonIcon className="mr-2" />
                        {t('themes.dark')}
                      </div>
                    </DropdownMenuItem>
                  </span>
                  <span onClick={() => toggleTheme('light')}>
                    <DropdownMenuItem className="text-md">
                      <div className="flex items-center justify-between">
                        <SunIcon className="mr-2" />
                        {t('themes.light')}
                      </div>
                    </DropdownMenuItem>
                  </span>
                </DropdownMenuSubContent>
              </DropdownMenuPortal>
            </DropdownMenuSub>
            <DropdownMenuSub>
              <DropdownMenuSubTrigger className="text-md my-2">
                {t('language')}
              </DropdownMenuSubTrigger>
              <DropdownMenuPortal>
                <DropdownMenuSubContent className="mx-3 w-36 p-xs">
                  <DropdownMenuItem
                    className="text-md mb-1"
                    onClick={() => updateUserLocaleAction('en')}
                  >
                    <div className="flex items-center justify-between">
                      <Image
                        src="/images/flagUS.png"
                        alt="US flag"
                        width={25}
                        height={25}
                        className="mr-2"
                      />
                      <span className="leading-5">English</span>
                    </div>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    className="text-md mb-1"
                    onClick={() => updateUserLocaleAction('lt')}
                  >
                    <div className="flex items-center justify-between">
                      <Image
                        src="/images/flagLT.png"
                        alt="US flag"
                        width={25}
                        height={25}
                        className="mr-2"
                      />
                      <span className="leading-5">Lietuvių</span>
                    </div>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    className="text-md mb-1"
                    onClick={() => updateUserLocaleAction('cz')}
                    disabled
                  >
                    <div className="flex items-center justify-between">
                      <Image
                        src="/images/flagCZ.png"
                        alt="US flag"
                        width={25}
                        height={25}
                        className="mr-2"
                      />
                      <span className="leading-5">Čeština</span>
                    </div>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="text-md mb-1" disabled>
                    <div className="flex items-center justify-between">
                      <Image
                        src="/images/flagPL.png"
                        alt="US flag"
                        width={25}
                        height={25}
                        className="mr-2"
                      />
                      <span className="leading-5">Polski</span>
                    </div>
                  </DropdownMenuItem>
                </DropdownMenuSubContent>
              </DropdownMenuPortal>
            </DropdownMenuSub>
            <Link href="/settings">
              <DropdownMenuItem className="text-md my-2">{t('settings')}</DropdownMenuItem>
            </Link>
            <DialogTrigger asChild>
              <DropdownMenuItem className="text-md my-2 hover:bg-black">
                {t('shortcuts')}
                <DropdownMenuShortcut>⌘K</DropdownMenuShortcut>
              </DropdownMenuItem>
            </DialogTrigger>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <span onClick={logout}>
            <DropdownMenuItem className="text-md mt-2">{t('logout')}</DropdownMenuItem>
          </span>
        </DropdownMenuContent>
      </DropdownMenu>
      <PageHeaderDialogContent />
    </Dialog>
  );
}

export default PageHeaderNav;
