'use client';

import React from 'react';
import type { IExerciseEntry } from '@shared/types';
import { cn } from '@/lib/utils';
import { useExerciseStore } from '@/components/exercise/store';

function ExerciseHintsSection({ ongoingEntry }: { ongoingEntry: IExerciseEntry }) {
  const changeIsDescriptionShown = useExerciseStore((state) => state.changeIsDescriptionShown);
  const isShown = useExerciseStore((state) => state.isShown);
  const setIsShown = useExerciseStore((state) => state.setIsShown);

  const handlePressingShow = (e: KeyboardEvent) => {
    if (e.code === 'KeyT') {
      setIsShown(!isShown);

      changeIsDescriptionShown(true);
    }
  };

  React.useEffect(() => {
    window.addEventListener('keydown', handlePressingShow);

    return () => {
      window.removeEventListener('keydown', handlePressingShow);
    };
  });

  return (
    <div
      className={`mt-md flex h-auto w-full cursor-pointer items-center justify-between rounded-md border bg-secondary px-xs py-xs transition-colors hover:bg-card-hover ${
        isShown ? 'backdrop-blur-none' : 'backdrop-blur-md'
      } transition-all duration-300`}
      onClick={() => setIsShown(!isShown)}
    >
      <p className={`transition-all ${isShown ? 'blur-0' : 'blur-sm'}`}>
        {ongoingEntry.description}
      </p>
      {!isShown && (
        <div className="absolute inset-0 flex items-center justify-between rounded-lg bg-black/50 px-xs py-sm transition-colors hover:bg-black/65">
          <p>Show description</p>
          <kbd
            className={cn('w-8 rounded-sm border bg-card-hover p-1 text-center', {
              hidden: isShown,
            })}
          >
            T
          </kbd>
        </div>
      )}
    </div>
  );
}

export default ExerciseHintsSection;
