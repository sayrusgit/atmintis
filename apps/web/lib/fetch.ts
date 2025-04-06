'use server';

import { type BetterFetchOption, createFetch } from '@better-fetch/fetch';
import { cookies } from 'next/headers';

const FIFTEEN_MINUTES = 15 * 60 * 1000;
const TWENTY_FOUR_HOURS = 24 * 60 * 60 * 1000;
const SEVEN_DAYS = 7 * 24 * 60 * 60 * 1000;
const isSecureCookie = process.env.NODE_ENV === 'production';

export const $fetch = createFetch({
  baseURL: process.env.API_URL,
  credentials: 'include',
  onRequest: async (ctx) => {
    const cookieStore = await cookies();
    const at = cookieStore.get('accessToken')?.value || '';

    ctx.headers.append('Cookie', `accessToken=${at}`);

    return ctx;
  },
});

export async function $post<T>(url: string, body: object | undefined, options?: BetterFetchOption) {
  const headers = new Headers();

  if (!(body instanceof FormData) && body) headers.set('Content-Type', 'application/json');

  return await $fetch<T>(url, {
    method: 'POST',
    body: body instanceof FormData ? body : JSON.stringify(body),
    headers,
    ...options,
  });
}

export async function $put<T>(url: string, body: object | undefined, options?: BetterFetchOption) {
  const headers = new Headers();

  if (!(body instanceof FormData) && body) headers.set('Content-Type', 'application/json');

  return await $fetch<T>(url, {
    method: 'PUT',
    body: body instanceof FormData ? body : JSON.stringify(body),
    headers,
    ...options,
  });
}

export async function $del<T>(url: string, options?: BetterFetchOption) {
  return await $fetch<T>(url, {
    method: 'DELETE',
    ...options,
  });
}
