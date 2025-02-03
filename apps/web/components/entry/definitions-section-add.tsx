'use client';

import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { getLocalSession } from '@/lib/session';
import { IEntry } from '@shared/types';
import { createDefinitionAction } from '@/lib/actions';
import { useRouter } from 'next/navigation';
import { $fetch } from '@/lib/fetch';

interface IReference {
  value: string;
  id: string;
}

function DefinitionsSectionAdd({ entryId }: { entryId: string }) {
  const router = useRouter();

  const [isOpen, setIsOpen] = useState(false);

  const [description, setDescription] = useState('');
  const [examplePrompt, setExamplePrompt] = useState('');
  const [examples, setExamples] = useState<string[]>([]);

  const [reference, setReference] = useState('');
  const [entryReference, setEntryReference] = useState<IReference>();
  const [synonyms, setSynonyms] = useState<IReference[]>([]);
  const [opposites, setOpposites] = useState<IReference[]>([]);
  const [compares, setCompares] = useState<IReference[]>([]);

  const [entries, setEntries] = useState<IEntry[] | null>(null);

  useEffect(() => {
    async function fetchEntries() {
      const user = await getLocalSession();

      const { data } = await $fetch<IEntry[]>('/entries/get-by-user/:id', {
        params: { id: user?.id },
      });

      setEntries(data);
    }

    fetchEntries();
  }, []);

  const handleCreate = async () => {
    await createDefinitionAction({
      description,
      examples,
      synonyms,
      opposites,
      compares,
      parentEntry: entryId,
    });

    setDescription('');
    setExamplePrompt('');
    setExamples([]);
    setIsOpen(false);

    router.refresh();
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <div className="flex cursor-pointer items-center justify-center rounded-xl border p-3 transition-colors hover:bg-hover">
          Add new
        </div>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create definition</DialogTitle>
          <DialogDescription>
            Create your definition here. Add more complex cases, specify examples, set up references
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="flex flex-col gap-2">
            <p className="text">Description</p>
            <Input
              id="definitionDescription"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="col-span-3"
              placeholder="Description"
              autoComplete="off"
            />
          </div>
          <div className="flex flex-col gap-xs">
            <p className="text">Examples</p>
            <div className="flex items-center justify-between gap-xs">
              <Input
                id="definitionExample"
                value={examplePrompt}
                onChange={(e) => setExamplePrompt(e.target.value)}
                placeholder="Type your example"
              />
              <Button
                size="sm"
                onClick={() => {
                  setExamples([...examples, examplePrompt]);
                  setExamplePrompt('');
                }}
              >
                Add
              </Button>
            </div>
            {examples.map((item) => (
              <p key={item}>• {item}</p>
            ))}
          </div>
          <div className="flex flex-col gap-2">
            <p>References</p>
            <div className="flex justify-between gap-xs">
              <Select onValueChange={setReference}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select a reference" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="synonym">Synonym</SelectItem>
                    <SelectItem value="opposite">Opposite</SelectItem>
                    <SelectItem value="compare">Compare</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
              <Select onValueChange={(value) => setEntryReference(JSON.parse(value))}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select an entry" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {entries?.map((item) => (
                      <SelectItem
                        value={JSON.stringify({ id: item._id, value: item.value })}
                        key={item._id}
                      >
                        {item.value}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
            <Button
              size="sm"
              onClick={() => {
                if (reference === 'synonym' && entryReference) {
                  setSynonyms([...synonyms, entryReference]);
                }
                if (reference === 'opposite' && entryReference) {
                  setOpposites([...opposites, entryReference]);
                }
                if (reference === 'compare' && entryReference) {
                  setCompares([...compares, entryReference]);
                }

                setReference('');
                setEntryReference(undefined);
              }}
              className="mt-xs"
            >
              Add
            </Button>
          </div>
        </div>
        {synonyms.map((item) => (
          <div key={item.id + Date.now()}>• {item.value}</div>
        ))}
        {opposites.map((item) => (
          <div key={item.id + Date.now()}>• {item.value}</div>
        ))}
        {compares.map((item) => (
          <div key={item.id + Date.now()}>• {item.value}</div>
        ))}
        <DialogFooter>
          <Button onClick={handleCreate}>Create</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default DefinitionsSectionAdd;
