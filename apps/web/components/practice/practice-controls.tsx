'use client';

import React, { useState } from 'react';
import { finishListPracticeSession, practiceResponseAction } from '@/lib/actions';
import { IPracticeSession } from '@shared/types';

function PracticeControls({ session }: { session: IPracticeSession }) {
  const [isTextRevealed, setIsTextRevealed] = useState(false);
  const [wasTextRevealed, setWasTextRevealed] = useState(false);

  const handleResponse = async (isCorrectAnswer: boolean) => {
    await practiceResponseAction(session._id, {
      isCorrectAnswer,
      isHintUsed: wasTextRevealed,
      nextEntryIndex: session.ongoingEntryIndex + 1,
    });

    setIsTextRevealed(false);
    setWasTextRevealed(false);

    if (session.totalEntries === session.ongoingEntryIndex + 1) {
      await finishListPracticeSession(session._id);
    }
  };

  const handlePressingYea = (e: KeyboardEvent) => {
    if (e.code === 'KeyI') handleResponse(true);
  };

  const handlePressingNay = (e: KeyboardEvent) => {
    if (e.code === 'KeyO') handleResponse(false);
  };

  const handlePressingReveal = (e: KeyboardEvent) => {
    if (e.code === 'KeyR') {
      setIsTextRevealed(!isTextRevealed);
      setWasTextRevealed(true);
    }
  };

  React.useEffect(() => {
    window.addEventListener('keypress', handlePressingYea);
    window.addEventListener('keypress', handlePressingNay);
    window.addEventListener('keypress', handlePressingReveal);

    return () => {
      window.removeEventListener('keypress', handlePressingYea, false);
      window.removeEventListener('keypress', handlePressingNay, false);
      window.removeEventListener('keypress', handlePressingReveal);
    };
  });

  return (
    <div>
      {isTextRevealed ? (
        <div
          className="flex min-h-[68px] w-full min-w-72 cursor-pointer items-center justify-center rounded-md border p-4 transition-colors hover:bg-muted"
          onClick={() => setIsTextRevealed(!isTextRevealed)}
        >
          {session.ongoingEntry.description}
        </div>
      ) : (
        <div
          className="flex w-full min-w-72 cursor-pointer rounded-md border p-4 transition-colors hover:bg-muted"
          onClick={() => {
            setWasTextRevealed(true);
            setIsTextRevealed(!isTextRevealed);
          }}
        >
          <div className="flex w-full items-center justify-between gap-xs">
            <p>Reveal text</p>
            <kbd className="w-8 rounded-sm border bg-background px-2.5 py-1 text-center">R</kbd>
          </div>
        </div>
      )}
      <div className="mt-lg flex justify-center gap-lg">
        <div
          className="flex h-32 w-32 cursor-pointer flex-col items-center justify-center rounded-md border bg-green-500/10 p-sm transition-colors hover:bg-green-500/30"
          onClick={() => handleResponse(true)}
        >
          <p className="mb-xs text-emerald-400">Yea</p>
          <kbd className="w-8 rounded-sm border bg-background p-1 text-center">I</kbd>
        </div>
        <div
          className="flex h-32 w-32 cursor-pointer flex-col items-center justify-center rounded-md border bg-red-500/20 p-sm transition-colors hover:bg-red-500/35"
          onClick={() => handleResponse(false)}
        >
          <p className="mb-xs text-red-400">Nay</p>
          <kbd className="w-8 rounded-sm border bg-background p-1 text-center">O</kbd>
        </div>
      </div>
    </div>
  );
}

export default PracticeControls;
