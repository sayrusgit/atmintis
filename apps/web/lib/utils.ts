import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export const STATIC_URL = String(process.env.NEXT_PUBLIC_STATIC_URL);

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function startFileDownload(
  data: any,
  filename: string,
  mime?: string,
  bom: any = undefined,
) {
  const blobData = typeof bom !== 'undefined' ? [bom, data] : [data];
  const blob = new Blob(blobData, { type: mime || 'application/octet-stream' });

  /* @ts-ignore */
  if (typeof window.navigator.msSaveBlob !== 'undefined') {
    /* @ts-ignore */
    window.navigator.msSaveBlob(blob, filename);
  } else {
    const blobURL =
      window.URL && window.URL.createObjectURL
        ? window.URL.createObjectURL(blob)
        : window.webkitURL.createObjectURL(blob);
    const tempLink = document.createElement('a');
    tempLink.style.display = 'none';
    tempLink.href = blobURL;
    tempLink.setAttribute('download', filename);

    if (typeof tempLink.download === 'undefined') {
      tempLink.setAttribute('target', '_blank');
    }

    document.body.appendChild(tempLink);
    tempLink.click();

    setTimeout(function () {
      document.body.removeChild(tempLink);
      window.URL.revokeObjectURL(blobURL);
    }, 200);
  }
}
