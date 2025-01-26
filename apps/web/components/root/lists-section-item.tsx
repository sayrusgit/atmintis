import React from 'react';
import { IList } from '@shared/types';
import Image from 'next/image';

function ListsSectionItem({ list }: { list: IList }) {
  return (
    <div className="flex h-36 w-full justify-between rounded-xl border p-md transition-colors hover:bg-secondary">
      <div className="flex flex-col justify-between">
        <p className="text-xl leading-5">{list.title}</p>
        <p className="text-muted-foreground">{list.entryNumber} entries</p>
      </div>
      {list.isDefault ? (
        <Image
          src="images/default-list.svg"
          alt="default list image"
          width={96}
          height={96}
          className="h-24 w-24 rounded-lg"
        />
      ) : list.image ? (
        <Image
          src={'http://localhost:5000/static/images/' + list.image}
          alt="default list image"
          width={96}
          height={96}
          className="h-24 w-24 rounded-lg object-cover"
        />
      ) : (
        <div className="h-24 w-24 rounded-lg bg-secondary"></div>
      )}
    </div>
  );
}

export default ListsSectionItem;
