import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { decrypt, updateSession } from '@/lib/session';

const publicRoutes = ['/signin', '/signup'];

export default async function middleware(req: NextRequest) {
  const path = req.nextUrl.pathname;
  const isPublicRoute = publicRoutes.includes(path);

  const cookieStore = await cookies();

  const accessToken = cookieStore.get('accessToken')?.value || '';
  const refreshToken = cookieStore.get('refreshToken')?.value || '';

  const session = await decrypt(accessToken);

  let isUpdated = false;
  let newAccessToken = '';

  if (!session?.sub && refreshToken) {
    const res = await updateSession(refreshToken);

    if (res?.success) {
      isUpdated = true;
      newAccessToken = res.response.tokens.accessToken;
    }
  }

  const response = isUpdated
    ? NextResponse.next({
        headers: {
          'Set-Cookie': `accessToken=${newAccessToken}; Path=/; HttpOnly; Secure; SameSite=Strict`,
        },
      })
    : NextResponse.next();

  if (!isPublicRoute && !session?.sub && !isUpdated) {
    return NextResponse.redirect(new URL('/signin', req.nextUrl));
  }

  if (isPublicRoute && (session?.sub || isUpdated)) {
    return NextResponse.redirect(new URL('/', req.nextUrl));
  }

  return response;
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|atmintis_logo.svg|icon.svg|.svg$|.*\\.png$).*)'],
};
