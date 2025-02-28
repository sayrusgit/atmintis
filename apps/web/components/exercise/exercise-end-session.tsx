'use client';

import React, { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { finishExerciseAction } from '@/lib/actions';
import { X } from 'lucide-react';

function ExerciseEndSession({ sessionId }: { sessionId: string }) {
  const handleEndSession = (e: KeyboardEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.shiftKey && e.code === 'KeyL') finishExerciseAction(sessionId);
  };

  useEffect(() => {
    window.addEventListener('keydown', handleEndSession);

    return () => {
      window.removeEventListener('keydown', handleEndSession);
    };
  }, []);

  return (
    <Button variant="outline" size="icon" onClick={() => finishExerciseAction(sessionId)}>
      <X className="icon-lg" />
    </Button>
  );
}

export default ExerciseEndSession;
