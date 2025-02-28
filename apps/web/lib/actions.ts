'use server';

import { deleteSession, getLocalSession } from '@/lib/session';
import type { CreateDefinitionDto, CreateEntryDto, ExerciseDto, UpdateEntryDto } from '@/lib/dto';
import { revalidatePath, revalidateTag } from 'next/cache';
import type { IEntry, IExercise, IResponse, IUser } from '@shared/types';
import { redirect } from 'next/navigation';
import { z } from 'zod';
import { $del, $fetch, $post, $put } from '@/lib/fetch';

const CreateEntrySchema = z.object({
  value: z.string().trim().nonempty(),
  description: z.string().trim().nonempty(),
  type: z.string().optional(),
  list: z.string().optional(),
});

export async function createEntryAction(data: CreateEntryDto) {
  const zData = CreateEntrySchema.safeParse(data);
  if (!zData.success) return;

  const user = await getLocalSession();

  await $post('/entries/create', { ...zData.data, userId: user?.id });

  revalidateTag('list-entries');
  revalidatePath('/');
}

export async function updateEntryAction(id: string, data: UpdateEntryDto) {
  await $put('/entries/:id', data, { params: { id } });

  revalidateTag('entry');
  redirect('/entry/' + id);
}

export async function reassignEntryAction(id: string, newListId: string) {
  await $put('/entries/reassign/:id', { list: newListId }, { params: { id } });

  revalidateTag('list-entries');
  revalidatePath('/');
}

export async function updateEntryImageAction(id: string, file: File) {
  const form = new FormData();
  form.append('file', file);

  await $put<IResponse<any>>('/entries/image/:id', form, {
    params: { id },
  });

  revalidateTag('entry');
}

export async function removeEntryAction(id: string) {
  await $del('/entries/:id', { params: { id } });

  revalidateTag('entry');
  revalidateTag('list-entries');
  revalidatePath('/');
}

export async function addTagToEntryAction(id: string, tags: string[]) {
  await $put('/entries/:id', { tags }, { params: { id } });

  revalidateTag('entry');
}

export async function removeTagFromEntryAction(id: string, tagToRemove: string) {
  const { data: entry } = await $fetch<IEntry>('/entries/:id', { params: { id } });

  const filteredTags = entry?.tags?.filter((item) => item !== tagToRemove);

  await $put('/entries/:id', { tags: filteredTags }, { params: { id } });

  revalidatePath('/entry/' + id);
}

export async function createDefinitionAction(data: CreateDefinitionDto) {
  const user = await getLocalSession();

  await $post('/definitions', { ...data, userId: user?.id });
}

export async function removeDefinitionAction(id: string) {
  await $del<IResponse<any>>('/definitions/:id', { params: { id } });
}

export async function startExerciseAction(listId: string) {
  const user = await getLocalSession();

  const { data } = await $post<IResponse<IExercise>>(
    '/exercises/start/:id',
    { userId: user?.id },
    { params: { id: listId } },
  );

  redirect('/exercise/' + data?.response._id);
}

export async function exerciseResponseAction(id: string, data: ExerciseDto) {
  await $put('/exercises/response/:id', data, { params: { id } });

  revalidatePath('/exercise/*');
}

export async function finishExerciseAction(id: string) {
  await $put('exercises/finish/:id', undefined, { params: { id } });

  revalidatePath('/exercise/*');
}

export async function createListAction(listTitle: string) {
  const user = await getLocalSession();

  await $post('/lists/', {
    title: listTitle,
    userId: user?.id,
    isDefault: false,
  });

  revalidatePath('/');
}

export async function updateListPrivacyAction(id: string, isPrivate: boolean) {
  await $put('/lists/:id', { isPrivate }, { params: { id } });

  revalidatePath('/lists/' + id);
}

export async function deleteListAction(id: string) {
  await $del('/lists/:id', { params: { id } });

  revalidatePath('/');
  revalidateTag('entry');
  redirect('/');
}

export async function importEntriesAction(id: string, file: File) {
  const form = new FormData();
  form.append('file', file);

  revalidateTag('list-entries');
  revalidatePath('/');

  return await $put('/entries/import/:id', form, { params: { id } });
}

export async function changeUserPasswordAction(state: any, formData: FormData) {
  const newPassword = formData.get('newPassword');
  const confirmNewPassword = formData.get('confirmNewPassword');

  if (newPassword !== confirmNewPassword) return { passwordError: true };

  const user = await getLocalSession();

  const { data, error } = await $put<IResponse<IUser>>('/users/change-password/:id', formData, {
    params: { id: user?.id },
  });

  if (!error) return { success: true, message: data.message };
  if (error) return { success: false, message: error.message };
}

export async function initializeEmailVerification() {
  const user = await getLocalSession();

  return await $post(`/users/initialize-email-verification/:id`, undefined, {
    params: { id: user?.id },
  });
}

export async function finalizeEmailVerification(state: any, form: FormData) {
  const user = await getLocalSession();
  const code = form.get('code') || '';

  if (!code) return;

  const { data, error } = await $put(
    '/users/finalize-email-verification/:id?code=:code',
    undefined,
    {
      params: { id: user?.id },
      query: { code },
    },
  );
  console.log(data);
  if (error && error.status === 400) return { codeError: error.message };

  revalidatePath('/settings');
}

export async function updateUserLocaleAction(locale: string) {
  const user = await getLocalSession();

  await $put('/users/update-locale/:id?locale=:locale', undefined, {
    params: { id: user?.id },
    query: { locale },
  });

  revalidatePath('/');
}

export async function deleteUserAction() {
  const user = await getLocalSession();

  await $del('/users/:id', { params: { id: user?.id } });

  await deleteSession();

  redirect('/signin');
}
