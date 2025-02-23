import React from 'react';
import { Card } from '@/components/ui/card';
import SettingsPasswordSection from '@/components/settings/settings-password-section';
import SettingsMfaSection from '@/components/settings/settings-mfa-section';
import type { IUser } from '@shared/types';

function SettingsSecuritySection({ user }: { user: IUser | null }) {
  return (
    <Card className="mt-md p-md pt-md">
      <h2 className="mb-sm text-2xl">Security</h2>
      <SettingsPasswordSection />
      <SettingsMfaSection user={user} />
    </Card>
  );
}

export default SettingsSecuritySection;
