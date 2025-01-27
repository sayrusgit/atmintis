'use client';

import React, { useState } from 'react';
import { EyeOffIcon } from 'lucide-react';
import Image from 'next/image';
import { IPracticeEntry } from '@shared/types';

function PracticeImage({ ongoingEntry }: { ongoingEntry: IPracticeEntry }) {
  const [isRevealed, setIsRevealed] = useState(false);
  const handleReveal = () => {
    setIsRevealed(!isRevealed);
  };

  if (!ongoingEntry.image)
    return (
      <div
        className="flex h-36 w-36 items-center justify-center rounded-xl bg-secondary/60"
        onClick={handleReveal}
      >
        <EyeOffIcon />
      </div>
    );

  return (
    <div
      className="flex h-36 w-36 cursor-pointer items-center justify-center rounded-xl bg-secondary transition-colors hover:bg-secondary/60"
      onClick={handleReveal}
    >
      {isRevealed ? (
        <Image
          src={'http://localhost:5000/static/entry-images/' + ongoingEntry.image}
          alt="Entry image"
          height={144}
          width={144}
          className="h-36 w-36 rounded-xl object-cover transition-opacity hover:opacity-60"
        />
      ) : (
        <EyeOffIcon />
      )}
    </div>
  );
}

export default PracticeImage;
