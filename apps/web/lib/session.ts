'use server';

import { cookies } from 'next/headers';
import { jwtVerify } from 'jose';
import { get } from '@/lib/neofetch';
import { IError, IJwtPayload, ILoginData, ISession, IUser } from '@shared/types';
import { API_URL } from '@/lib/utils';

const FIFTEEN_MINUTES = 15 * 60 * 1000;
const TWENTY_FOUR_HOURS = 24 * 60 * 60 * 1000;
const SEVEN_DAYS = 7 * 24 * 60 * 60 * 1000;

const secret = process.env.JWT || '';
const encodedKey = new TextEncoder().encode(secret);
const isSecureCookie = process.env.BUILD === 'build';

export const createSession = async (
  login: string,
  password: string,
  mfaCode?: string,
): Promise<ILoginData | IError> => {
  try {
    const rawRes = await fetch(API_URL + 'auth/login', {
      headers: { 'Content-Type': 'application/json' },
      method: 'POST',
      body: mfaCode
        ? JSON.stringify({ login, password, mfaCode })
        : JSON.stringify({ login, password }),
    });
    const res: ILoginData = await rawRes.json();

    if (!res?.success) return res as unknown as IError;

    const cookieStore = await cookies();

    cookieStore.set('accessToken', res.response.tokens.accessToken, {
      maxAge: TWENTY_FOUR_HOURS,
      path: '/',
      httpOnly: true,
      sameSite: 'lax',
      secure: isSecureCookie,
    });

    cookieStore.set('refreshToken', res.response.tokens.refreshToken, {
      maxAge: SEVEN_DAYS,
      path: '/',
      httpOnly: true,
      sameSite: 'lax',
      secure: isSecureCookie,
    });

    return res;
  } catch (err: any) {
    console.log(err);

    return {
      statusCode: 500,
      message: 'Something went wrong',
      error: err.message,
    };
  }
};

export async function updateSession(rt: string): Promise<ILoginData | undefined> {
  try {
    const cookieStore = await cookies();

    const headers = new Headers({
      Cookie: `refreshToken=${rt}; `,
    });

    const rawRes = await fetch(API_URL + 'auth/refresh', {
      method: 'GET',
      credentials: 'include',
      headers,
    });
    const res: ILoginData = await rawRes.json();

    if (!res.success) return;

    cookieStore.set('accessToken', res.response.tokens.accessToken, {
      maxAge: TWENTY_FOUR_HOURS,
      path: '/',
      httpOnly: true,
      sameSite: 'lax',
      secure: isSecureCookie,
    });

    cookieStore.set('refreshToken', res.response.tokens.refreshToken, {
      maxAge: SEVEN_DAYS,
      path: '/',
      httpOnly: true,
      sameSite: 'lax',
      secure: isSecureCookie,
    });

    return res;
  } catch (err) {
    console.log(err);
  }
}

export async function deleteSession() {
  const cookieStore = await cookies();

  cookieStore.delete('accessToken');
  cookieStore.delete('refreshToken');
}

export const getSession = async (): Promise<IUser | null> => {
  const res = await get<IUser | IError>('users/me');

  if ('error' in res) return null;

  return res as IUser;
};

export const getLocalSession = async (): Promise<ISession | undefined> => {
  const cookieStore = await cookies();

  const at = cookieStore.get('accessToken')?.value;
  const rt = cookieStore.get('refreshToken')?.value;

  if (!at) return;

  try {
    const decodedSession = await decrypt(at);

    if (!decodedSession) await updateSession(rt || '');

    return {
      id: decodedSession!.sub,
      username: decodedSession!.username,
      email: decodedSession!.email,
    };
  } catch (err) {
    return;
  }
};

export async function decrypt(
  accessToken: string | undefined = '',
): Promise<IJwtPayload | undefined> {
  try {
    const { payload } = await jwtVerify<IJwtPayload>(accessToken, encodedKey, {
      algorithms: ['HS256'],
    });

    return payload;
  } catch (error) {
    return;
  }
}
