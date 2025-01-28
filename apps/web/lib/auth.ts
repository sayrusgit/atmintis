import { createSession, deleteSession, updateSession } from '@/lib/session';
import { redirect } from 'next/navigation';
import { IMfaPayload, IResponse, ITokens } from '@shared/types';
import { post } from '@/lib/neofetch';
import { z } from 'zod';
import { API_URL } from '@/lib/utils';

const SignInSchema = z.object({
  login: z.string().nonempty(),
  password: z.string().nonempty(),
  mfaCode: z.string().optional(),
});

export async function signin(state: any, formData: FormData) {
  const zData = SignInSchema.safeParse(Object.fromEntries(formData));
  if (!zData.success) return;

  const res = await createSession(zData.data.login, zData.data.password, zData.data.mfaCode);

  if (!('success' in res)) {
    if (res.statusCode === 400) return { loginMessage: res.message };

    if (res.statusCode === 401) return { passwordMessage: res.message };

    if (res.statusCode === 417) return { mfa: true };
  }

  redirect('/');
}

const SignUpSchema = z.object({
  username: z.string().trim().nonempty(),
  email: z.string().email().nonempty(),
  password: z.string().min(8).nonempty(),
  confirmPassword: z.string().nonempty(),
  file: z.instanceof(File).optional(),
});

export async function signup(state: any, formData: FormData) {
  const zData = SignUpSchema.safeParse(Object.fromEntries(formData));
  if (!zData.success) return;

  if (zData.data.password !== zData.data.confirmPassword) return { passwordError: true };

  const raw = await fetch(API_URL + 'auth/signup', {
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
