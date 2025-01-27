'use server';

import { getLocalSession } from '@/lib/session';
import { post, del, put } from '@/lib/neofetch';
import {
  CreateDefinitionDto,
  CreateEntryDto,
  PracticeResponseDto,
  UpdateEntryDto,
} from '@/lib/dto';
import { revalidatePath } from 'next/cache';
import { IPracticeSession, IResponse, IUser } from '@shared/types';
import { redirect } from 'next/navigation';

export async function createEntryAction(data: CreateEntryDto) {
  const user = await getLocalSession();

  const res = await post<IResponse<any>>('entries/create', { ...data, userId: user?.id });

  revalidatePath('/list/*');

  return res;
}

export async function updateEntryAction(data: UpdateEntryDto) {
  const res = await put<IResponse<any>>('entries/' + data._id, data);

  redirect('/entry/' + data._id);
}

export async function removeEntryAction(entryId: string) {
  const res = await del<IResponse<any>>('entries/' + entryId);

  revalidatePath('/list/*');

  return res;
}

export async function addTagToEntryAction(entryId: string, tags: string[]) {
  await put('entries/' + entryId, { tags });

  revalidatePath('/entries/' + entryId);
}

export async function removeTagFromEntryAction(entryId: string, tags: string[]) {}

export async function createDefinitionAction(data: CreateDefinitionDto) {
  const user = await getLocalSession();

  await post('definitions', { ...data, userId: user?.id });
}

export async function startListPracticeAction(listId: string) {
  const user = await getLocalSession();

  const practiceSession = await post<IResponse<IPracticeSession>>('practice/start-list/' + listId, {
    userId: user?.id,
  });

  redirect('/practice/' + practiceSession.response._id);
}

export async function practiceResponseAction(sessionId: string, data: PracticeResponseDto) {
  await put('practice/response/' + sessionId, data);

  revalidatePath('/practice/*');
}

export async function finishListPracticeSession(sessionId: string) {
  await put('practice/finish/' + sessionId, null);

  revalidatePath('/practice/*');
}

export async function createListAction(listTitle: string) {
  const user = await getLocalSession();

  await post(
    'lists',
    {
      title: listTitle,
      userId: user?.id,
      isDefault: false,
    },
    false,
  );

  revalidatePath('/');
}

export async function updateListPrivacyAction(listId: string, isPrivate: boolean) {
  await put('lists/' + listId, { isPrivate });

  revalidatePath('/lists/' + listId);
}

export async function deleteListAction(listId: string) {
  await del('lists/' + listId);

  redirect('/');
}

export async function changeUserPasswordAction(state: any, formData: FormData) {
  const newPassword = formData.get('newPassword');
  const confirmNewPassword = formData.get('confirmNewPassword');

  if (newPassword !== confirmNewPassword) return { passwordError: true };

  const user = await getLocalSession();

  const res = await put<IResponse<IUser>>('users/change-password/' + user?.id, formData, true);

  if (res?.success) return { success: true, message: res.message };
}
