import { getSession } from '@/lib/session';
import React from 'react';
import SettingsProfileSection from '@/components/settings/settings-profile-section';
import type { Metadata } from 'next';
import SettingsSecuritySection from '@/components/settings/settings-security-section';
import SettingsDangerZoneSection from '@/components/settings/settings-danger-zone-section';

export const metadata: Metadata = { title: 'Settings | atmintis' };

async function Page() {
  const user = await getSession();

  return (
    <div>
      <h1 className="text-4xl">Settings</h1>
      <SettingsProfileSection user={user} />
      <SettingsSecuritySection user={user} />
      <SettingsDangerZoneSection user={user} />
    </div>
  );
}

export default Page;
