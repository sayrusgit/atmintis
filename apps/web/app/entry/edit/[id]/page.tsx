'use client';

import React from 'react';
import { useParams } from 'next/navigation';

type Props = { params: Promise<{ id: string }> };

function Page({ params }: Props) {
  const { id } = useParams();

  return <div>bruh</div>;
}

export default Page;
