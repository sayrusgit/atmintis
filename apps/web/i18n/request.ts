import { getRequestConfig } from 'next-intl/server';
import { getSession } from '@/lib/session';

export default getRequestConfig(async () => {
  const user = await getSession();

  const locale = user?.locale || 'en';

  return {
    locale,
    messages: (await import(`../messages/${locale}.json`)).default,
  };
});
