'use client';

import React from 'react';
import {
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

function HeaderDialogContent() {
  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle className="font-medium">Keyboard shortcuts</DialogTitle>
      </DialogHeader>
      <DialogDescription>
        <span className="gap-xs grid grid-cols-2">
          <span>Open keyboard shortcuts</span>
          <kbd className="text-foreground-heading">Shift + K</kbd>
          <span>New entry</span>
          <kbd className="text-foreground-heading">Ctrl + /</kbd>
          <span>Start practice</span>
          <kbd className="text-foreground-heading">Shift + P</kbd>
          <span>Answer Yea in practice session</span>
          <kbd className="text-foreground-heading">I</kbd>
          <span>Answer Nay in practice session</span>
          <kbd className="text-foreground-heading">O</kbd>
          <span>Reveal text in practice session</span>
          <kbd className="text-foreground-heading">T</kbd>
          <span>Reveal image in practice session</span>
          <kbd className="text-foreground-heading">Y</kbd>
          <span>Finish practice sesison</span>
          <kbd className="text-foreground-heading">Shift + L</kbd>
        </span>
      </DialogDescription>
    </DialogContent>
  );
}

export default HeaderDialogContent;
