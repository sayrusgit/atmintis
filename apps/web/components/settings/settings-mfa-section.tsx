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

function SettingsMfaSection({ user }: { user: IUser | null }) {
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
    const res = await enableMfaAction(user!._id);

    if (res.qrcode) setMfaData(res);
  };

  const handleDisable = async () => {
    const res = await disableMfaAction(user!._id, value);

    setDisablingError(res);

    if (res) {
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
      <Dialog open={isDisablingDialogOpen} onOpenChange={setIsDisablingDialogOpen}>
        <DialogTrigger asChild>
          <Button variant="destructive" onClick={handleEnable}>
            Disable
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Enter OTP code</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col">
            <Input
              placeholder="OTP code"
              id="token"
              name="token"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              maxLength={6}
            />
            {disablingError && <span className="mt-xs text-sm text-red-400">Invalid OTP code</span>}
            <Button onClick={handleDisable} className="mt-sm">
              Disable
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    );

  return (
    <Dialog open={isEnablingDialogOpen} onOpenChange={setIsEnablingDialogOpen}>
      <DialogTrigger asChild>
        <Button onClick={handleEnable}>Enable</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Continue in Google Authenticator</DialogTitle>
          <DialogDescription>
            Scan QR below or add the secret token manually in your OTP application.
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col items-center gap-md">
          {mfaData.qrcode && (
            <Image
              src={mfaData.qrcode}
              alt="MFA qrcode"
              width={192}
              height={192}
              className="h-48 w-48 rounded-xl"
            />
          )}
          <code className="text-xs text-foreground-heading">{mfaData.secret}</code>
          <Input
            placeholder="OTP code"
            id="token"
            name="token"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            maxLength={6}
          />
          <Button onClick={handleFinalize}>Enable</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default SettingsMfaSection;
