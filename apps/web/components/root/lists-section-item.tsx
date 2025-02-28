import React from 'react';
import type { IList } from '@shared/types';
import Image from 'next/image';
import { STATIC_URL } from '@/lib/utils';
import { Card } from '@/components/ui/card';
import { ImageIcon } from 'lucide-react';
import { getTranslations } from 'next-intl/server';

async function ListsSectionItem({ list }: { list: IList }) {
  const t = await getTranslations('root');

  return (
    <Card className="flex w-full justify-between rounded-xl border p-sm transition-colors hover:border-border-hover">
      <div className="flex flex-col justify-between">
        <p className="text-xl leading-5">{list.isDefault ? t('defaultList') : list.title}</p>
        <p className="text-muted-foreground">
          {list.entryNumber} {t('entries')}
        </p>
      </div>
      {list.isDefault ? (
        <Image
          src="images/default-list.svg"
          alt="default list image"
          width={80}
          height={80}
          className="h-20 w-20 rounded-lg"
        />
      ) : list.image ? (
        <Image
          src={STATIC_URL + '/images/' + list.image}
          alt="default list image"
          width={80}
          height={80}
          className="h-20 w-20 rounded-lg object-cover"
        />
      ) : (
        <div className="flex h-20 w-20 items-center justify-center rounded-lg bg-secondary">
          <ImageIcon className="h-14 w-14 text-muted-foreground" strokeWidth={1} />
        </div>
      )}
    </Card>
  );
}

export default ListsSectionItem;
