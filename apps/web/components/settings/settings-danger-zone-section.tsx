'use client';

import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { IUser } from '@shared/types';
import { Input } from '@/components/ui/input';
import { deleteUserAction } from '@/lib/actions';
import { useTranslations } from 'use-intl';

function SettingsDangerZoneSection({ user }: { user: IUser | null }) {
  const t = useTranslations('settings.danger');

  const [value, setValue] = useState('');

  return (
    <Card className="mt-md p-md pt-md">
      <h2 className="mb-sm text-2xl leading-none">{t('title')}</h2>
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button variant="destructive">{t('delete')}</Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t('modal.title')}</AlertDialogTitle>
            <AlertDialogDescription>{t('modal.description')}</AlertDialogDescription>
            <div>
              <Input
                value={value}
                onChange={(e) => setValue(e.target.value)}
                className="mt-xs"
                placeholder={user?.email}
              />
            </div>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t('modal.cancel')}</AlertDialogCancel>
            <AlertDialogAction disabled={user?.email !== value} onClick={deleteUserAction}>
              {t('modal.delete')}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Card>
  );
}

export default SettingsDangerZoneSection;
