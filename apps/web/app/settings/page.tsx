import { Card, CardContent } from '@/components/ui/card';
import { getSession } from '@/lib/session';
import SettingsPasswordSection from '@/components/settings/settings-password-section';
import React from 'react';
import SettingsProfilePicture from '@/components/settings/settings-profile-picture';

async function Page() {
  const user = await getSession();

  return (
    <div>
      <h1 className="text-4xl">Settings</h1>
      <Card className="mt-lg">
        <CardContent className="p-md pt-md">
          <h2 className="mb-sm text-2xl leading-none">Profile</h2>
          <div className="flex items-start gap-md">
            <SettingsProfilePicture user={user} />
            <p className="text-xl font-medium">{user?.username}</p>
          </div>
          <h2 className="my-sm text-2xl">Password</h2>
          <SettingsPasswordSection />
          <h2 className="my-sm text-2xl">2FA</h2>
        </CardContent>
      </Card>
    </div>
  );
}

export default Page;
