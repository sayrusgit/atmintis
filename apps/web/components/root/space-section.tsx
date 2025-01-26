import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChevronDown } from 'lucide-react';

function SpaceSection() {
  return (
    <Card className="flex justify-between px-md py-sm">
      <div className="flex min-w-28 cursor-pointer items-center justify-between rounded-md bg-secondary p-2 transition-colors hover:bg-muted-foreground">
        Main <ChevronDown className="icon-lg" />
      </div>
      <Button>New list</Button>
    </Card>
  );
}

export default SpaceSection;
