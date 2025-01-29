'use server';

import { getLocalSession } from '@/lib/session';
import {
  CreateDefinitionDto,
  CreateEntryDto,
  PracticeResponseDto,
  UpdateEntryDto,
} from '@/lib/dto';
import { revalidatePath } from 'next/cache';
import { IPracticeSession, IResponse, IUser } from '@shared/types';
import { redirect } from 'next/navigation';
import { z } from 'zod';
import { $del, $post, $put } from '@/lib/fetch';

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

  revalidatePath('/list/*');
}

export async function updateEntryAction(data: UpdateEntryDto) {
  await $put('/entries/' + data._id, data);

  redirect('/entry/' + data._id);
}

export async function removeEntryAction(id: string) {
  await $del('/entries/:id', { params: { id } });

  revalidatePath('/list/*');
}

export async function addTagToEntryAction(id: string, tags: string[]) {
  await $put('/entries/:id', { tags }, { params: { id } });

  revalidatePath('/entries/' + id);
}

export async function removeTagFromEntryAction(entryId: string, tags: string[]) {}

export async function createDefinitionAction(data: CreateDefinitionDto) {
  const user = await getLocalSession();

  await $post('/definitions', { ...data, userId: user?.id });
}

export async function startListPracticeAction(listId: string) {
  const user = await getLocalSession();

  const { data } = await $post<IResponse<IPracticeSession>>(
    '/practice/start-list/:id',
    { userId: user?.id },
    { params: { id: listId } },
  );

  redirect('/practice/' + data?.response._id);
}

export async function practiceResponseAction(id: string, data: PracticeResponseDto) {
  await $put('/practice/response/:id', data, { params: { id } });

  revalidatePath('/practice/*');
}

export async function finishListPracticeSession(id: string) {
  await $put('practice/finish/:id', undefined, { params: { id } });

  revalidatePath('/practice/*');
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

  redirect('/');
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
}

export async function updateUserLocaleAction(locale: string) {
  const user = await getLocalSession();

  await $put(`/users/update-locale/:id?locale=${locale}`, undefined, { params: { id: user?.id } });

  revalidatePath('/');
}
