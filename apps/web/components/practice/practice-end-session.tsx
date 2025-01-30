'use client';

import React, { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { finishListPracticeSession } from '@/lib/actions';

function PracticeEndSession({ sessionId }: { sessionId: string }) {
  const handleEndSession = (e: KeyboardEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.shiftKey && e.code === 'KeyL') finishListPracticeSession(sessionId);
  };

  useEffect(() => {
    window.addEventListener('keypress', handleEndSession);

    return () => {
      window.removeEventListener('keypress', handleEndSession);
    };
  }, []);

  return (
    <Button size="lg" onClick={() => finishListPracticeSession(sessionId)}>
      End session
    </Button>
  );
}

export default PracticeEndSession;
