'use client';

import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { initializeEmailVerification } from '@/lib/actions';

function SettingsProfileSectionSend() {
  const [isSent, setIsSent] = useState(false);
  const [isDisabled, setIsDisabled] = useState(false);
  const [countdown, setCountdown] = useState(60); // Timeout period in seconds

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isDisabled) {
      timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev === 1) {
            clearInterval(timer);
            setIsDisabled(false);
            return 60;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isDisabled]);

  const sendVerificationEmail = async () => {
    await initializeEmailVerification();

    setIsDisabled(true);
    setIsSent(true);
    setCountdown(60);
  };

  return (
    <div className="flex flex-col items-center space-y-4">
      <Button
        onClick={(e) => {
          e.preventDefault();
          sendVerificationEmail();
        }}
        disabled={isDisabled}
        variant="outline"
      >
        {isDisabled ? `Wait ${countdown}s` : isSent ? 'Resend' : 'Send'}
      </Button>
    </div>
  );
}

export default SettingsProfileSectionSend;
