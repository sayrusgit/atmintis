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

  let isUpdated;

  if (!session?.sub && refreshToken) {
    isUpdated = await updateSession(refreshToken);
  }

  if (!isPublicRoute && !session?.sub && !isUpdated) {
    return NextResponse.redirect(new URL('/signin', req.nextUrl));
  }

  if (isPublicRoute && (session?.sub || isUpdated)) {
    return NextResponse.redirect(new URL('/', req.nextUrl));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|atmintis_logo.svg|.svg$|.*\\.png$).*)'],
};
