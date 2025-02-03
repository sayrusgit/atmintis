'use client';

import React, { useActionState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { changeUserPasswordAction } from '@/lib/actions';
import { useTranslations } from 'use-intl';

function SettingsPasswordSection() {
  const t = useTranslations('settings.security');

  const [state, action, pending] = useActionState(changeUserPasswordAction, undefined);

  return (
    <form action={action} className="">
      <h3 className="mb-xs text-xl">{t('password.title')}</h3>
      <div className="max-w-80 space-y-xs">
        <Input
          placeholder={t('password.oldPassword')}
          id="oldPassword"
          name="oldPassword"
          type="password"
          variant="filled"
        />
        <Input
          placeholder={t('password.newPassword')}
          id="newPassword"
          name="newPassword"
          type="password"
          variant="filled"
        />
        <Input
          placeholder={t('password.confirmNewPassword')}
          id="confirmNewPassword"
          name="confirmNewPassword"
          type="password"
          variant="filled"
        />
      </div>
      <div className="mt-sm flex items-center gap-sm">
        <Button type="submit" disabled={pending}>
          {t('password.changePassword')}
        </Button>
        {state?.passwordError && (
          <p className="text-sm text-red-400">{t('password.error.doNotMatch')}</p>
        )}
        {state?.success ? (
          <p className="text-sm text-success">{state.message}</p>
        ) : (
          <p className="text-sm text-red-400">{state?.message}</p>
        )}
      </div>
    </form>
  );
}

export default SettingsPasswordSection;
