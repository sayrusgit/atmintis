import { manrope } from '@/styles/fonts';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

async function Page() {
  return (
    <div>
      <div className="flex justify-between">
        <div>
          <div className="flex items-end gap-xs">
            <h1 className={`${manrope.className} text-4xl text-foreground-heading`}>rough</h1>
            <p className="italic text-muted-foreground">adjective</p>
          </div>
          <div className="mt-sm flex gap-xs">
            <Badge>American English</Badge>
            <Badge>informal</Badge>
          </div>
          <div className="my-sm flex gap-lg">
            <div className="mt-sm flex items-center gap-xs">
              <div className="h-7 w-7 rounded-xs bg-blue-800"></div>
              <span className="italic leading-none">/rʌf/</span>
            </div>
            <div className="mt-sm flex items-center gap-xs">
              <div className="h-7 w-7 rounded-xs bg-primary bg-red-800"></div>
              <span className="italic leading-none">/rʌf/</span>
            </div>
          </div>
          <div>
            <p className="text-lg leading-none">rude, brutal, unsmooth </p>
          </div>
        </div>
        <div className="h-28 w-28 rounded-xl bg-accent"></div>
      </div>
      <hr className="my-lg" />
      <div className="flex items-start justify-between gap-md rounded-xl border p-4">
        <div className="flex flex-col gap-xs">
          not smooth; having an uneven or irregular surface
          <ol>
            <li>• rough ground</li>
            <li>• The skin on her hands was hard and rough</li>
          </ol>
        </div>
        <div className="flex w-[30%] flex-col gap-1 rounded-md bg-secondary p-xs">
          <p className="text-sm">opposite</p>
          <a href="" className="text-blue-500">
            approximate
          </a>
        </div>
      </div>
      <div className="mt-lg flex items-start justify-between gap-md rounded-xl border p-4">
        <div className="flex flex-col gap-xs">
          not smooth; having an uneven or irregular surface
          <ol>
            <li>• rough ground</li>
            <li>• The skin on her hands was hard and rough</li>
          </ol>
        </div>
        <div className="flex w-[30%] flex-col gap-1 rounded-md bg-secondary p-xs">
          <p className="text-sm">opposite</p>
          <a href="" className="text-blue-500">
            approximate
          </a>
        </div>
      </div>
    </div>
  );
}

export default Page;
