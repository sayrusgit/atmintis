import React from 'react';
import { get } from '@/lib/neofetch';
import { IPracticeSession } from '@shared/types';
import PracticeControls from '@/components/practice/practice-controls';
import { Card } from '@/components/ui/card';
import PracticeImage from '@/components/practice/practice-image';

type Props = { params: Promise<{ id: string }> };

async function Page({ params }: Props) {
  const { id } = await params;

  const practiceSession = await get<IPracticeSession>('practice/sessions/' + id);
  if (!practiceSession?._id) return <div>No practice session</div>;

  const practiceSessionRedis = await get<IPracticeSession>('practice/sessions/redis/' + id);

  if (practiceSession.isFinished)
    return (
      <div>
        <h1>Session data</h1>
        <div>Total entries: {practiceSession.totalEntries}</div>
        <div>Correct answers: {practiceSession.correctAnswersCount}</div>
        <div>Hints used: {practiceSession.hintsUsed}</div>
      </div>
    );

  return (
    <div>
      <h1 className="text-center text-4xl">Practice mode</h1>
      <Card className="mt-lg flex flex-col items-center gap-lg p-md">
        <p className="text-center text-sm">
          {practiceSessionRedis.ongoingEntryIndex + 1} / {practiceSession.totalEntries}
        </p>
        <PracticeImage ongoingEntry={practiceSessionRedis.ongoingEntry} />
        <p className="text-center text-xl font-medium">
          {practiceSessionRedis?.ongoingEntry?.value}
        </p>
        <PracticeControls session={practiceSessionRedis} />
      </Card>
    </div>
  );
}

export default Page;
