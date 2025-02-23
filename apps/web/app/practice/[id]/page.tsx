import React from 'react';
import type { IPracticeSession } from '@shared/types';
import PracticeControls from '@/components/practice/practice-controls';
import { Card } from '@/components/ui/card';
import PracticeImage from '@/components/practice/practice-image';
import { $fetch } from '@/lib/fetch';
import PracticeEndSession from '@/components/practice/practice-end-session';

type Props = { params: Promise<{ id: string }> };

async function Page({ params }: Props) {
  const { id } = await params;

  const { data: session, error } = await $fetch<IPracticeSession>('/practice/sessions/:id', {
    params: { id },
  });

  if (error) return <div>No practice session</div>;

  const { data: sessionRedis, error: errorRedis } = await $fetch<IPracticeSession>(
    '/practice/sessions/redis/:id',
    {
      params: { id },
    },
  );

  if (errorRedis && !session.isFinished)
    return <div>Practice session is expired. Would you like to start the new one?</div>;

  if (session.isFinished)
    return (
      <div>
        <h1>Session data</h1>
        <div>Total entries: {session.totalEntries}</div>
        <div>Correct answers: {session.correctAnswersCount}</div>
        <div>Hints used: {session.hintsUsed}</div>
      </div>
    );

  if (sessionRedis)
    return (
      <div>
        <div className="flex justify-between">
          <h1 className="text-4xl">Practice mode</h1>
          <PracticeEndSession sessionId={session._id} />
        </div>
        <Card className="mt-lg flex flex-col items-center gap-lg p-md">
          <p className="text-center text-sm">
            {sessionRedis.ongoingEntryIndex + 1} / {session.totalEntries}
          </p>
          <PracticeImage ongoingEntry={sessionRedis.ongoingEntry} />
          <p className="text-center text-xl font-medium">{sessionRedis.ongoingEntry.value}</p>
          <PracticeControls session={sessionRedis} />
        </Card>
      </div>
    );
}

export default Page;
