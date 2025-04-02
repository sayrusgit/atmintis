import React from 'react';
import { Card } from '@/components/ui/card';
import { $fetch } from '@/lib/fetch';
import type { IEntry, IExercise } from '@shared/types';
import ExerciseEndSession from '@/components/exercise/exercise-end-session';
import ExerciseImage from '@/components/exercise/exercise-image';
import ExerciseControls from '@/components/exercise/exercise-controls';
import ExerciseConfidence from '@/components/exercise/exercise-confidence';
import ExerciseHintsSection from '@/components/exercise/exercise-hints-section';
import type { Metadata } from 'next';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { RotateCw } from 'lucide-react';
import { startExerciseAction } from '@/lib/actions';
import ExerciseSessionFinished from '@/components/exercise/exercise-session-finished';

type Props = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;

  const { data } = await $fetch<IEntry>('/entries/' + id, {
    cache: 'force-cache',
    next: { tags: ['entry'] },
  });

  return {
    title: `${data?.value} | atmintis`,
  };
}

async function Page({ params }: Props) {
  const { id } = await params;

  const { data: session, error } = await $fetch<IExercise>('/exercises/:id', {
    params: { id },
  });

  if (error) return <div>No practice session</div>;

  const { data: sessionRedis, error: errorRedis } = await $fetch<IExercise>(
    '/exercises/redis/:id',
    {
      params: { id },
    },
  );

  if (errorRedis && !session.isFinished)
    return <div>Practice session is expired. Would you like to start the new one?</div>;

  if (session.isFinished && session.list)
    return <ExerciseSessionFinished session={session} list={session.list} />;

  if (sessionRedis)
    return (
      <div>
        <div className="flex items-center justify-between">
          <h1 className="text-4xl">Exercise</h1>
          <ExerciseEndSession sessionId={session._id} />
        </div>
        <Card className="mt-md flex flex-col gap-lg p-md">
          <div className="flex gap-md">
            <ExerciseImage ongoingEntry={sessionRedis.ongoingEntry} />
            <div className="w-full">
              <h2 className="font text-2xl">{sessionRedis.ongoingEntry.value}</h2>
              <ExerciseConfidence confidenceScore={sessionRedis?.ongoingEntry.confidenceScore} />
              <ExerciseHintsSection ongoingEntry={sessionRedis.ongoingEntry} />
            </div>
          </div>
          <ExerciseControls session={sessionRedis} />
          <p className="text-center text-sm">
            {sessionRedis.ongoingEntryIndex + 1} / {session.totalEntries}
          </p>
        </Card>
      </div>
    );
}

export default Page;
