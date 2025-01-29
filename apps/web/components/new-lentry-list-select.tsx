import * as React from 'react';
import { ChevronsUpDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { IList } from '@shared/types';
import { useTranslations } from 'use-intl';

interface NewEntryListSelectProps {
  lists: IList[] | null;
  setList: (listId: string) => void;
}

export function NewEntryListSelect({ lists, setList }: NewEntryListSelectProps) {
  const t = useTranslations('header');

  const [open, setOpen] = React.useState(false);
  const [value, setValue] = React.useState('');

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between"
        >
          {value ? lists?.find((list) => list._id === value)?.title : t('NewEntry.form.list')}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0 md:w-[583px]" align="start">
        <Command>
          <CommandInput placeholder="Select a list..." className="h-9" />
          <CommandList>
            <CommandEmpty>No list found.</CommandEmpty>
            <CommandGroup>
              {lists?.map((list: IList) => (
                <CommandItem
                  value={`${list.title};${list._id}`}
                  key={list._id}
                  onSelect={() => {
                    setValue(list._id);
                    setList(list._id);
                    setOpen(false);
                  }}
                >
                  {list.title}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
