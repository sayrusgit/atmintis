'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { disableMfaAction, enableMfaAction, finalizeMfaAction } from '@/lib/auth';
import { IMfaPayload, IUser } from '@shared/types';
import { Input } from '@/components/ui/input';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { useTranslations } from 'use-intl';

function SettingsMfaSection({ user }: { user: IUser | null }) {
  const t = useTranslations('settings.security.mfa');

  const router = useRouter();

  const [mfaData, setMfaData] = useState<IMfaPayload>({
    secret: '',
    qrcode: '',
  });
  const [value, setValue] = useState('');
  const [disablingError, setDisablingError] = useState(false);
  const [isEnablingDialogOpen, setIsEnablingDialogOpen] = useState(false);
  const [isDisablingDialogOpen, setIsDisablingDialogOpen] = useState(false);

  const handleEnable = async () => {
    const { data, error } = await enableMfaAction(user!._id);

    if (!error) setMfaData(data);
  };

  const handleDisable = async () => {
    const { error } = await disableMfaAction(user!._id, value);

    setDisablingError(!!error);

    if (!error) {
      setDisablingError(false);
      setValue('');
      setIsDisablingDialogOpen(false);
      router.refresh();
    }
  };

  const handleFinalize = async () => {
    const res = await finalizeMfaAction(user!._id, value);

    if (res) {
      setDisablingError(false);
      setValue('');
      setIsEnablingDialogOpen(true);
      router.refresh();
    }
  };

  if (user?.mfa.isEnabled)
    return (
      <div>
        <h3 className="mb-xs mt-sm text-xl">{t('title')}</h3>
        <Dialog open={isDisablingDialogOpen} onOpenChange={setIsDisablingDialogOpen}>
          <DialogTrigger asChild>
            <Button variant="destructive" onClick={handleEnable}>
              {t('disable')}
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>{t('disableModal.title')}</DialogTitle>
            </DialogHeader>
            <div className="flex flex-col">
              <Input
                placeholder={t('otpCode')}
                id="token"
                name="token"
                value={value}
                onChange={(e) => setValue(e.target.value)}
                maxLength={6}
              />
              {disablingError && (
                <span className="mt-xs text-sm text-red-400">
                  {t('disableModal.invalidOtpCode')}
                </span>
              )}
              <Button onClick={handleDisable} className="mt-sm">
                {t('disable')}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    );

  return (
    <div>
      <h3 className="mb-xs mt-sm text-xl">{t('title')}</h3>
      <Dialog open={isEnablingDialogOpen} onOpenChange={setIsEnablingDialogOpen}>
        <DialogTrigger asChild>
          <Button onClick={handleEnable}>{t('enable')}</Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{t('enableModal.title')}</DialogTitle>
            <DialogDescription>{t('enableModal.description')}</DialogDescription>
          </DialogHeader>
          <div className="flex flex-col items-center gap-md">
            <div className="h-48 w-48">
              {mfaData.qrcode && (
                <Image
                  src={mfaData.qrcode}
                  alt="MFA qrcode"
                  width={192}
                  height={192}
                  className="h-48 w-48 rounded-xl"
                />
              )}
            </div>
            <code className="text-xs text-foreground-heading">{mfaData.secret}</code>
            <Input
              placeholder={t('otpCode')}
              id="token"
              name="token"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              maxLength={6}
            />
            <Button onClick={handleFinalize}>{t('enable')}</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default SettingsMfaSection;
