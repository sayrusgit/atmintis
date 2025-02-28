'use client';

import React, { useState } from 'react';
import type { IExercise } from '@shared/types';
import { exerciseResponseAction, finishExerciseAction } from '@/lib/actions';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

function ExerciseControls({ session }: { session: IExercise }) {
  const [isPositive, setIsPositive] = useState<boolean | null>(null);

  const handleResponse = async () => {
    if (isPositive !== null) {
      setIsPositive(null);

      await exerciseResponseAction(session._id, {
        isPositive,
        isHintUsed: false,
        nextEntryIndex: session.ongoingEntryIndex + 1,
      });

      if (session.totalEntries === session.ongoingEntryIndex + 1) {
        await finishExerciseAction(session._id);
      }
    }
  };

  const handlePressingYea = (e: KeyboardEvent) => {
    if (e.code === 'KeyI') setIsPositive(true);
  };

  const handlePressingNay = (e: KeyboardEvent) => {
    if (e.code === 'KeyO') setIsPositive(false);
  };

  const handlePressingResponse = (e: KeyboardEvent) => {
    if (e.code === 'Enter') handleResponse();
  };

  React.useEffect(() => {
    window.addEventListener('keydown', handlePressingYea);
    window.addEventListener('keydown', handlePressingNay);
    window.addEventListener('keydown', handlePressingResponse);

    return () => {
      window.removeEventListener('keydown', handlePressingYea);
      window.removeEventListener('keydown', handlePressingNay);
      window.removeEventListener('keydown', handlePressingResponse);
    };
  });

  return (
    <div>
      <div className="flex flex-col justify-center gap-sm">
        <div
          className={cn(
            'flex h-12 w-full cursor-pointer items-center justify-between rounded-md border bg-secondary px-xs py-sm transition-colors hover:bg-card-hover',
            {
              'border-2 border-emerald-400': isPositive,
            },
          )}
          onClick={() => setIsPositive(true)}
        >
          <p className="text-emerald-400">Yea</p>
          <kbd className="w-8 rounded-sm border bg-background p-1 text-center">I</kbd>
        </div>
        <div
          className={cn(
            'flex h-12 w-full cursor-pointer items-center justify-between rounded-md border bg-secondary px-xs py-sm transition-colors hover:bg-card-hover',
            {
              'border-2 border-red-400': isPositive === false,
            },
          )}
          onClick={() => setIsPositive(false)}
        >
          <p className="text-red-400">Nay</p>
          <kbd className="w-8 rounded-sm border bg-background p-1 text-center">O</kbd>
        </div>
      </div>
      <div className="mt-lg flex items-center justify-between">
        <Button>Skip</Button>
        <Button
          onClick={() => {
            if (isPositive !== null) handleResponse();
          }}
          disabled={isPositive === null}
        >
          Continue
        </Button>
      </div>
    </div>
  );
}

export default ExerciseControls;
