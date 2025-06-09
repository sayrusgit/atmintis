'use client';

import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { startExerciseAction } from '@/lib/actions';
import { RotateCw } from 'lucide-react';
import { Card } from '@/components/ui/card';
import type { IExercise } from '@shared/types';

function ExerciseSessionFinished({ session, list }: { session: IExercise; list: string }) {
  const finishedAt = session ? new Date(session.finishedAt).toLocaleDateString('en-US') : null;

  return (
    <Card className="p-md">
      <div className="flex justify-between">
        <div>
          <h1 className="text-2xl leading-none">Exercise session</h1>
          <p className="mt-xs text-muted-foreground text-sm">{finishedAt}</p>
        </div>
        <Link href={'/collection/' + list}>
          <Button size="sm" variant="ghost">
            Back to collection
          </Button>
        </Link>
      </div>
      <div className="mt-lg grud-cols-1 gap-sm xs:grid-cols-3 grid">
        <div className="flex flex-col items-center">
          <p>Correct answers:</p>
          <p className="mt-xs text-4xl font-medium">
            {(session.positiveAnswersCount / session.totalEntries) * 100}%
          </p>
        </div>
        <div className="flex flex-col items-center">
          <p>Images revealed:</p>
          <p className="mt-xs text-4xl font-medium">{session.imagesRevealed}</p>
        </div>
        <div className="flex flex-col items-center">
          <p>Text revealed:</p>
          <p className="mt-xs text-4xl font-medium">{session.hintsUsed}</p>
        </div>
      </div>
      <div className="mt-xl flex justify-center">
        <Button size="lg" onClick={() => startExerciseAction(list)}>
          <RotateCw />
          Repeat
        </Button>
      </div>
    </Card>
  );
}

export default ExerciseSessionFinished;
