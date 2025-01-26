'use server';

import { cookies } from 'next/headers';

const API_URL = 'http://localhost:5000/api';

type TMethod = 'GET' | 'POST' | 'PUT' | 'DELETE';

async function get<T>(url: string): Promise<T> {
  return await fetcher(url);
}

async function post<T>(url: string, body: any, isFormData?: boolean): Promise<T> {
  return await fetcher(url, 'POST', body, isFormData);
}

async function put<T>(url: string, body: any, isFormData?: boolean): Promise<T> {
  return await fetcher(url, 'PUT', body, isFormData);
}

async function del<T>(url: string): Promise<T> {
  return await fetcher(url, 'DELETE');
}

const fetcher = async (url: string, method: TMethod = 'GET', body?: any, isFormData?: boolean) => {
  const cookieStore = await cookies();
  const at = cookieStore.get('accessToken')?.value || '';

  const headers = new Headers();
  headers.set('Cookie', `accessToken=${at}`);

  if (!isFormData && body) headers.set('Content-Type', 'application/json');

  try {
    let raw = await fetch(API_URL + '/' + url, {
      method,
      credentials: 'include',
      headers,
      body: isFormData ? body : JSON.stringify(body),
    });

    return await raw.json();
  } catch (err) {
    return {
      statusCode: 500,
      error: err,
    };
  }
};

export { get, post, put, del };
