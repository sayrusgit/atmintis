import React from 'react';
import { LoaderCircleIcon } from 'lucide-react';

function Loading() {
  return (
    <div className="mt-xl flex items-center justify-center">
      <LoaderCircleIcon className="animate-spin" />
    </div>
  );
}

export default Loading;
