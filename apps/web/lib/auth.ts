import { createSession, deleteSession, updateSession } from '@/lib/session';
import { redirect } from 'next/navigation';
import { ITokens } from '@shared/types';

export async function signin(state: any, formData: FormData) {
  const username = formData.get('username') as string;
  const password = formData.get('password') as string;

  const res = await createSession(username, password);

  if (!res?.success) {
    return { errors: res };
  }

  redirect('/');
}

export async function signup(state: any, formData: FormData) {
  const password = formData.get('password') as string;
  const passwordConfirmation = formData.get('passwordConfirmation') as string;

  if (password !== passwordConfirmation) return { passwordError: true };

  const raw = await fetch('http://localhost:5000/api/auth/signup', {
    method: 'POST',
    body: formData,
  });
  if (!raw.ok) return { message: 'Something went wrong' };
  const tokens = (await raw.json()) as ITokens;

  await updateSession(tokens.refreshToken);

  redirect('/');
}

export async function logout() {
  await deleteSession();

  return redirect('/signin');
}
