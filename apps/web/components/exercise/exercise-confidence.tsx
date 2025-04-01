import React from 'react';
import { cn } from '@/lib/utils';

type Props = { confidenceScore: number };

async function ExerciseConfidence({ confidenceScore }: Props) {
  const confidenceLabel = (() => {
    if (confidenceScore <= 500) return 'Very low';
    if (confidenceScore <= 700) return 'Low';
    if (confidenceScore <= 1300) return 'Medium';
    if (confidenceScore < 1500) return 'High';
    if (confidenceScore >= 1500) return 'Very high';
  })();

  return (
    <p
      className={cn('text-xs', {
        'text-red-600': confidenceLabel === 'Very low',
        'text-red-400': confidenceLabel === 'Low',
        'text-orange-400': confidenceLabel === 'Medium',
        'text-green-600': confidenceLabel === 'High',
        'text-emerald-400': confidenceLabel === 'Very high',
      })}
    >
      {confidenceLabel} confidence
    </p>
  );
}

export default ExerciseConfidence;
