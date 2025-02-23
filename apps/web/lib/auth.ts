import { createSession, deleteSession, updateSession } from '@/lib/session';
import { redirect } from 'next/navigation';
import type { IMfaPayload, IResponse, ITokens } from '@shared/types';
import { z } from 'zod';
import { $post } from '@/lib/fetch';

const SignInSchema = z.object({
  login: z.string().nonempty(),
  password: z.string().nonempty(),
  mfaCode: z.string().optional(),
});

export async function signin(state: any, formData: FormData) {
  const zData = SignInSchema.safeParse(Object.fromEntries(formData));
  if (!zData.success) return;

  const { error } = await createSession(zData.data.login, zData.data.password, zData.data.mfaCode);

  if (error) {
    if (error.status === 400) return { loginMessage: error.message };
    if (error.status === 401) return { passwordMessage: error.message };
    if (error.status === 417) return { mfa: true };
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

  const file = formData.get('file') as File;
  if (file!.size === 0) formData.delete('file');

  if (zData.data.password !== zData.data.confirmPassword) return { passwordError: true };

  const { data, error } = await $post<ITokens>('/auth/signup', formData);
  if (error) return { message: error.message };
  await updateSession(data.refreshToken);

  redirect('/');
}

export async function logout() {
  await deleteSession();

  return redirect('/signin');
}

export async function enableMfaAction(id: string) {
  return await $post<IMfaPayload>('/users/enable-mfa/:id', undefined, {
    params: { id },
  });
}

export async function finalizeMfaAction(id: string, token: string) {
  return await $post<IMfaPayload>(
    '/users/finalize-mfa/:id',
    { token },
    {
      params: { id },
    },
  );
}

export async function disableMfaAction(id: string, token: string) {
  return await $post<IResponse<any>>('/users/disable-mfa/:id', { token }, { params: { id } });
}
