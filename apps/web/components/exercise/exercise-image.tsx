'use client';

import React, { useState } from 'react';
import { EyeOffIcon } from 'lucide-react';
import Image from 'next/image';
import type { IExerciseEntry } from '@shared/types';

function ExerciseImage({ ongoingEntry }: { ongoingEntry: IExerciseEntry }) {
  const [isRevealed, setIsRevealed] = useState(false);
  const handleReveal = () => {
    setIsRevealed(!isRevealed);
  };
  /* TODO: add zustand and connect image with text revelation*/
  if (!ongoingEntry?.image)
    return (
      <div
        className="flex h-44 min-w-44 items-center justify-center rounded-xl bg-secondary"
        onClick={handleReveal}
      >
        <EyeOffIcon />
      </div>
    );

  return (
    <div
      className="flex h-44 w-44 cursor-pointer items-center justify-center rounded-xl bg-secondary transition-colors hover:bg-card-hover"
      onClick={handleReveal}
    >
      {isRevealed ? (
        <Image
          src={'http://localhost:5000/static/entry-images/' + ongoingEntry.image}
          alt="Entry image"
          height={144}
          width={144}
          className="h-36 w-36 min-w-44 rounded-xl object-cover transition-opacity hover:opacity-60"
        />
      ) : (
        <EyeOffIcon />
      )}
    </div>
  );
}

export default ExerciseImage;
