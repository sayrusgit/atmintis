'use client';

import { IDefinition, IEntry, IEntryContext } from '@shared/types';
import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { removeDefinitionAction, updateEntryAction } from '@/lib/actions';
import { manrope } from '@/styles/fonts';
import TagsSection from '@/components/entry/tags-section';
import { useFetch } from '@/lib/hooks';
import Link from 'next/link';
import { Card } from '@/components/ui/card';
import { InputUnderlined } from '@/components/ui/input-underlined';
import { useTranslations } from 'use-intl';
import { $fetch } from '@/lib/fetch';
import { XIcon } from 'lucide-react';

type IData = {
  value: string;
  description: string;
  type: string | undefined;
  context: IEntryContext[] | undefined;
  image: string;
};

function Page() {
  const t = useTranslations('header');

  const { id } = useParams<{ id: string }>();

  const [entry, setEntry] = useFetch<IEntry>('/entries/' + id);
  const [definitions, setDefinitions] = useState<IDefinition[]>([]);
  const [data, setData] = useState<IData>({
    value: '',
    description: '',
    type: '',
    context: [],
    image: '',
  });
  const [context, setContext] = useState<IEntryContext>({ value: '', color: '' });

  useEffect(() => {
    if (entry) {
      setData({
        value: entry.value,
        description: entry.description,
        type: entry.type,
        context: entry.context,
        image: entry.image,
      });
    }
  }, [entry]);

  useEffect(() => {
    const fetchDefinitions = async () => {
      const { data, error } = await $fetch<IDefinition[]>('/definitions/get-by-entry/:id', {
        params: { id },
      });

      !error && setDefinitions(data);
    };
    fetchDefinitions();
  }, []);

  return (
    <div>
      <div>
        <div>
          <div className="flex items-end gap-md">
            <h1 className={`${manrope.className} animate-pulse text-4xl`}>{entry?.value}</h1>
            <Select onValueChange={(e) => setData({ ...data, type: e })}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder={entry?.type} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="noun">{t('NewEntry.form.types.noun')}</SelectItem>
                <SelectItem value="adjective">{t('NewEntry.form.types.adjective')}</SelectItem>
                <SelectItem value="verb">{t('NewEntry.form.types.verb')}</SelectItem>
                <SelectItem value="adverb">{t('NewEntry.form.types.adverb')}</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <TagsSection entry={entry} />
          <div className="mt-md flex gap-xs">
            <Select onValueChange={(e) => setContext({ ...context, color: e })}>
              <SelectTrigger className={`w-24 text-${context.color || 'foreground'}`}>
                <SelectValue placeholder="Color" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="reddish" className="text-reddish focus:text-reddish">
                  Red
                </SelectItem>
                <SelectItem value="greenish" className="text-greenish focus:text-greenish">
                  Green
                </SelectItem>
                <SelectItem value="bluish" className="text-bluish focus:text-bluish">
                  Blue
                </SelectItem>
              </SelectContent>
            </Select>
            <Input
              placeholder="Context"
              className="w-40 italic"
              value={context.value}
              onChange={(e) => setContext({ ...context, value: e.target.value })}
              onKeyDown={(event) => {
                if (event.key === 'Enter' && context.value && context.color) {
                  const contextArray = data.context;
                  contextArray?.push(context);

                  setData({ ...data, context: contextArray });
                  setContext({ ...context, value: '' });
                }
              }}
            />
          </div>
          <div className="mt-sm flex flex-wrap gap-sm">
            {data.context?.map((context) => (
              <div className="flex items-center gap-xs" key={context.value + entry?._id}>
                <div
                  className={`h-7 w-7 rounded-xs bg-${context.color} flex items-center justify-center`}
                >
                  <XIcon
                    className="icon cursor-pointer opacity-0 transition-opacity hover:opacity-100"
                    onClick={() => {
                      const filteredArray = data.context?.filter(
                        (item) => item.value !== context.value,
                      );
                      console.log(filteredArray);
                      setData({ ...data, context: filteredArray });
                    }}
                  />
                </div>
                <span className="italic leading-none">{context.value}</span>
              </div>
            ))}
          </div>
          <InputUnderlined
            value={data.description}
            onChange={(e) => setData({ ...data, description: e.target.value })}
            className="mt-lg"
          />
        </div>
        <Button className="mt-lg w-full" onClick={() => updateEntryAction(entry!._id, data)}>
          Edit
        </Button>
      </div>
      <div className="mt-lg space-y-lg">
        {definitions.map((definition: IDefinition) => (
          <Card
            className="relative flex items-start justify-between gap-md p-4"
            key={definition._id}
          >
            <div className="flex flex-col gap-xs">
              {definition.description}
              <ol>
                {definition.examples?.map((example) => (
                  <li key={example.toLowerCase() + Date.now()}>• {example}</li>
                ))}
              </ol>
            </div>
            <div className="w-[30%]">
              {definition.synonyms?.map((synonym) => (
                <div className="flex flex-col gap-1 rounded-md bg-secondary p-xs" key={synonym._id}>
                  <p className="text-sm">synonym</p>
                  <Link href={'/entry/' + synonym.id} className="text-blue-500">
                    {synonym.value}
                  </Link>
                </div>
              ))}
              {definition.opposites?.map((synonym) => (
                <div className="flex flex-col gap-1 rounded-md bg-secondary p-xs" key={synonym._id}>
                  <p className="text-sm">opposite</p>
                  <Link href={'/entry/' + synonym.id} className="text-blue-500">
                    {synonym.value}
                  </Link>
                </div>
              ))}
              {definition.compares?.map((synonym) => (
                <div className="flex flex-col gap-1 rounded-md bg-secondary p-xs" key={synonym._id}>
                  <p className="text-sm">compare</p>
                  <Link href={'/entry/' + synonym.id} className="text-blue-500">
                    {synonym.value}
                  </Link>
                </div>
              ))}
            </div>
            <div
              onClick={() => removeDefinitionAction(definition._id)}
              className="absolute right-2 top-2 flex h-6 min-w-6 cursor-pointer items-center justify-center rounded-md bg-destructive hover:bg-destructive/80"
            >
              <XIcon className="icon" />
            </div>
          </Card>
        ))}
      </div>
      {/*<div className="mt-lg flex flex-col gap-md">*/}
      {/*  <Card className="flex items-start justify-between gap-md p-4">*/}
      {/*    <div className="flex flex-col gap-xs">*/}
      {/*      <Input placeholder="Definition" />*/}
      {/*      <Input placeholder="Definition" />*/}
      {/*    </div>*/}
      {/*    <div className="flex w-[30%] flex-col gap-1 rounded-md bg-secondary p-xs">*/}
      {/*      <p className="text-sm">compare</p>*/}
      {/*      <Link href={'/entry/sdf'} className="text-blue-500">*/}
      {/*        bruh*/}
      {/*      </Link>*/}
      {/*    </div>*/}
      {/*  </Card>*/}
      {/*</div>*/}
    </div>
  );
}

export default Page;
