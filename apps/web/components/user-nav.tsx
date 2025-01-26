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

function NavUser({ user }: { user: IUser }) {
  const { theme, setTheme } = useTheme();

  const toggleTheme = (themeToChange: string) => {
    if (theme === themeToChange) return;
    console.log(theme);
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
              src={`http://localhost:5000/static/images/${user?.profilePicture}`}
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
              {/* premium status as well */}
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator className="my-2" />
          <DropdownMenuGroup>
            <DropdownMenuSub>
              <DropdownMenuSubTrigger className="text-md my-2">Theme</DropdownMenuSubTrigger>
              <DropdownMenuPortal>
                <DropdownMenuSubContent className="mx-3 w-36 p-xs">
                  <span onClick={() => toggleTheme('dark')}>
                    <DropdownMenuItem className="text-md mb-1">
                      <div className="flex items-center justify-between">
                        <MoonIcon className="mr-2" />
                        Dark
                      </div>
                    </DropdownMenuItem>
                  </span>
                  <span onClick={() => toggleTheme('light')}>
                    <DropdownMenuItem className="text-md">
                      <div className="flex items-center justify-between">
                        <SunIcon className="mr-2" />
                        Light
                      </div>
                    </DropdownMenuItem>
                  </span>
                </DropdownMenuSubContent>
              </DropdownMenuPortal>
            </DropdownMenuSub>
            <DropdownMenuSub>
              <DropdownMenuSubTrigger className="text-md my-2">Language</DropdownMenuSubTrigger>
              <DropdownMenuPortal>
                <DropdownMenuSubContent className="mx-3 w-36 p-xs">
                  <DropdownMenuItem className="text-md mb-1">
                    <div className="flex items-center justify-between">
                      <Image
                        src="/images/FlagUS.png"
                        alt="US flag"
                        width={25}
                        height={25}
                        className="mr-2"
                      />
                      <span className="leading-5">English</span>
                    </div>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="text-md mb-1" disabled>
                    <div className="flex items-center justify-between">
                      <Image
                        src="/images/FlagLT.png"
                        alt="US flag"
                        width={25}
                        height={25}
                        className="mr-2"
                      />
                      <span className="leading-5">Lietuvių</span>
                    </div>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="text-md mb-1" disabled>
                    <div className="flex items-center justify-between">
                      <Image
                        src="/images/FlagCZ.png"
                        alt="US flag"
                        width={25}
                        height={25}
                        className="mr-2"
                      />
                      <span className="leading-5">Čeština</span>
                    </div>
                  </DropdownMenuItem>
                </DropdownMenuSubContent>
              </DropdownMenuPortal>
            </DropdownMenuSub>
            <Link href="/settings">
              <DropdownMenuItem className="text-md my-2">Settings</DropdownMenuItem>
            </Link>
            <DialogTrigger asChild>
              <DropdownMenuItem className="text-md my-2 hover:bg-black">
                Keyboard shortcuts
                <DropdownMenuShortcut>⌘K</DropdownMenuShortcut>
              </DropdownMenuItem>
            </DialogTrigger>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <span onClick={logout}>
            <DropdownMenuItem className="text-md mt-2">Log out</DropdownMenuItem>
          </span>
        </DropdownMenuContent>
      </DropdownMenu>
      <PageHeaderDialogContent />
    </Dialog>
  );
}

export default NavUser;
