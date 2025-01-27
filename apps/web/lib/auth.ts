import { createSession, deleteSession, updateSession } from '@/lib/session';
import { redirect } from 'next/navigation';
import { IMfaPayload, IResponse, ITokens } from '@shared/types';
import { post } from '@/lib/neofetch';

export async function signin(state: any, formData: FormData) {
  const login = formData.get('login') as string;
  const password = formData.get('password') as string;
  const mfaCode = formData.get('mfaCode') as string;

  const res = await createSession(login, password, mfaCode);
  console.log(res);
  if (!('success' in res)) {
    if (res.statusCode === 400) return { loginMessage: res.message };

    if (res.statusCode === 401) return { passwordMessage: res.message };

    if (res.statusCode === 417) return { mfa: true };
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

export async function enableMfaAction(userId: string): Promise<IMfaPayload> {
  return await post<IMfaPayload>('users/enable-mfa/' + userId, {});
}

export async function finalizeMfaAction(userId: string, token: string): Promise<IMfaPayload> {
  return await post<IMfaPayload>('users/finalize-mfa/' + userId, { token });
}

export async function disableMfaAction(userId: string, token: string) {
  const res = await post<IResponse<boolean>>('users/disable-mfa/' + userId, { token });

  return res.success;
}
