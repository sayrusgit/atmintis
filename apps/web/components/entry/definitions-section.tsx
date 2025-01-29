import React from 'react';
import { IDefinition } from '@shared/types';
import Link from 'next/link';
import { Card } from '@/components/ui/card';
import DefinitionsSectionAdd from '@/components/entry/definitions-section-add';
import { $fetch } from '@/lib/fetch';

async function DefinitionSection({ entryId }: { entryId: string }) {
  const { data: definitions } = await $fetch<IDefinition[]>('/definitions/get-by-entry/:id', {
    params: { id: entryId },
  });

  return (
    <div className="space-y-lg">
      {definitions?.map((definition: IDefinition) => (
        <Card className="flex items-start justify-between gap-md p-4" key={definition._id}>
          <div className="flex flex-col gap-xs">
            {definition.description}
            <ol>
              {definition.examples?.map((example) => (
                <li key={example.toLowerCase() + Date.now()}>• {example}</li>
              ))}
            </ol>
          </div>
          {definition.synonyms?.map((synonym) => (
            <div
              className="flex w-[30%] flex-col gap-1 rounded-md bg-secondary p-xs"
              key={synonym._id}
            >
              <p className="text-sm">synonym</p>
              <Link href={'/entry/' + synonym.id} className="text-blue-500">
                {synonym.value}
              </Link>
            </div>
          ))}
          {definition.opposites?.map((synonym) => (
            <div
              className="flex w-[30%] flex-col gap-1 rounded-md bg-secondary p-xs"
              key={synonym._id}
            >
              <p className="text-sm">opposite</p>
              <Link href={'/entry/' + synonym.id} className="text-blue-500">
                {synonym.value}
              </Link>
            </div>
          ))}
          {definition.compares?.map((synonym) => (
            <div
              className="flex w-[30%] flex-col gap-1 rounded-md bg-secondary p-xs"
              key={synonym._id}
            >
              <p className="text-sm">compare</p>
              <Link href={'/entry/' + synonym.id} className="text-blue-500">
                {synonym.value}
              </Link>
            </div>
          ))}
        </Card>
      ))}
      <DefinitionsSectionAdd entryId={entryId} />
    </div>
  );
}

export default DefinitionSection;
