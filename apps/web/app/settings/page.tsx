import { Card, CardContent } from '@/components/ui/card';
import { getSession } from '@/lib/session';
import SettingsPasswordSection from '@/components/settings/settings-password-section';
import React from 'react';
import SettingsMfaSection from '@/components/settings/settings-mfa-section';
import SettingsProfileSection from '@/components/settings/settings-profile-section';

async function Page() {
  const user = await getSession();

  return (
    <div>
      <h1 className="text-4xl">Settings</h1>
      <Card className="mt-lg">
        <CardContent className="p-md pt-md">
          <h2 className="mb-sm text-2xl leading-none">Profile</h2>
          <SettingsProfileSection user={user} />
          <h2 className="my-sm text-2xl">Password</h2>
          <SettingsPasswordSection />
          <h2 className="my-sm text-2xl">Multi-factor authentication</h2>
          <SettingsMfaSection user={user} />
        </CardContent>
      </Card>
    </div>
  );
}

export default Page;
