import React, { useCallback, useMemo } from 'react';
import { Card } from '@/components/ui/card';
import { $fetch } from '@/lib/fetch';
import type { IExercise } from '@shared/types';
import ExerciseEndSession from '@/components/exercise/exercise-end-session';
import ExerciseImage from '@/components/exercise/exercise-image';
import ExerciseControls from '@/components/exercise/exercise-controls';

type Props = { params: Promise<{ id: string }> };

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

  const confidenceLabel = (() => {
    if (sessionRedis !== null) {
      if (sessionRedis.ongoingEntry.confidenceScore <= 500) return 'Very low';
      if (sessionRedis.ongoingEntry.confidenceScore <= 700) return 'Low';
      if (sessionRedis.ongoingEntry.confidenceScore <= 1300) return 'Medium';
      if (sessionRedis.ongoingEntry.confidenceScore < 1500) return 'High';
      if (sessionRedis.ongoingEntry.confidenceScore >= 1500) return 'Very high';
    }
  })();

  if (errorRedis && !session.isFinished)
    return <div>Practice session is expired. Would you like to start the new one?</div>;

  if (session.isFinished)
    return (
      <div>
        <h1>Session data</h1>
        <div>Total entries: {session.totalEntries}</div>
        <div>Correct answers: {session.positiveAnswersCount}</div>
        <div>Hints used: {session.hintsUsed}</div>
      </div>
    );

  if (sessionRedis)
    return (
      <div>
        <div className="flex items-center justify-between">
          <h1 className="text-4xl">Exercise</h1>
          <p className="text-sm">
            {sessionRedis.ongoingEntryIndex + 1} / {session.totalEntries}
          </p>
          <ExerciseEndSession sessionId={session._id} />
        </div>
        <Card className="mt-md flex flex-col gap-lg p-md">
          <div className="flex gap-md">
            <ExerciseImage ongoingEntry={sessionRedis.ongoingEntry} />
            <div>
              <h2 className="font text-2xl">{sessionRedis.ongoingEntry.value}</h2>
              <p className="text-xs">{confidenceLabel} confidence</p>
            </div>
          </div>
          <ExerciseControls session={sessionRedis} />
        </Card>
      </div>
    );
}

export default Page;
