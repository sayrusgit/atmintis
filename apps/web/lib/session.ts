'use server';

import { cookies } from 'next/headers';
import { jwtVerify } from 'jose';
import { IError, IJwtPayload, ILoginData, ISession, IUser } from '@shared/types';
import { API_URL } from '@/lib/utils';
import { $fetch, $post } from '@/lib/fetch';

const FIFTEEN_MINUTES = 15 * 60 * 1000;
const TWENTY_FOUR_HOURS = 24 * 60 * 60 * 1000;
const SEVEN_DAYS = 7 * 24 * 60 * 60 * 1000;

const secret = process.env.JWT || '';
const encodedKey = new TextEncoder().encode(secret);
const isSecureCookie = process.env.BUILD === 'build';

export const createSession = async (login: string, password: string, mfaCode?: string) => {
  const payload = mfaCode ? { login, password, mfaCode } : { login, password };

  const res = await $post<ILoginData>('/auth/login', payload);

  const cookieStore = await cookies();

  if (!res.error) {
    cookieStore.set('accessToken', res.data.response.tokens.accessToken, {
      maxAge: TWENTY_FOUR_HOURS,
      path: '/',
      httpOnly: true,
      sameSite: 'lax',
      secure: isSecureCookie,
    });

    cookieStore.set('refreshToken', res.data.response.tokens.refreshToken, {
      maxAge: SEVEN_DAYS,
      path: '/',
      httpOnly: true,
      sameSite: 'lax',
      secure: isSecureCookie,
    });
  }

  return res;
};

export async function updateSession(rt: string): Promise<ILoginData | undefined> {
  try {
    const cookieStore = await cookies();

    const headers = new Headers({
      Cookie: `refreshToken=${rt}; `,
    });

    const { data, error } = await $fetch<ILoginData>(API_URL + '/auth/refresh', {
      credentials: 'include',
      headers,
    });

    if (error) return;

    cookieStore.set('accessToken', data.response.tokens.accessToken, {
      maxAge: TWENTY_FOUR_HOURS,
      path: '/',
      httpOnly: true,
      sameSite: 'lax',
      secure: isSecureCookie,
    });

    cookieStore.set('refreshToken', data.response.tokens.refreshToken, {
      maxAge: SEVEN_DAYS,
      path: '/',
      httpOnly: true,
      sameSite: 'lax',
      secure: isSecureCookie,
    });

    return data;
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
  const { data, error } = await $fetch<IUser | IError>('users/me');

  if (error) return null;

  return data as IUser;
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
